import { Request, Response } from 'express';
import User from '../models/User';
import { sendWelcomeEmail } from '../services/emailService';

export const getUsers = async (req: Request, res: Response) => {
  try {
    // Only get non-deleted users
    const users = await User.find({ isDeleted: false }).select('-googleId');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role, department, phoneNumber, joinDate } = req.body;
    
    // Check if email already exists (including soft deleted)
    const existingUser = await User.findOne({ email });
    if (existingUser && !existingUser.isDeleted) {
      return res.status(400).json({ 
        message: 'Email already exists',
        field: 'email'
      });
    }
    
    // Parse date properly
    let parsedDate = new Date();
    if (joinDate) {
      if (joinDate.includes('-') && joinDate.split('-').length === 3) {
        const [day, month, year] = joinDate.split('-');
        parsedDate = new Date(year, month - 1, day);
      } else {
        parsedDate = new Date(joinDate);
      }
    }
    
    const user = new User({
      name,
      email,
      googleId: `manual_${Date.now()}`,
      role,
      department,
      phoneNumber,
      joinDate: parsedDate,
      isDeleted: false
    });

    await user.save();
    
    // Send welcome email
    await sendWelcomeEmail({
      name: user.name,
      email: user.email,
      role: user.role
    });
    
    res.status(201).json(user);
  } catch (error: any) {
    console.error('Create user error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Email already exists',
        field: 'email'
      });
    }
    
    res.status(400).json({ message: 'Error creating user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Check if email already exists for different user (excluding soft deleted)
    if (updates.email) {
      const existingUser = await User.findOne({ 
        email: updates.email, 
        _id: { $ne: id },
        isDeleted: false
      });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Email already exists',
          field: 'email'
        });
      }
    }
    
    // Parse date if provided
    if (updates.joinDate) {
      if (updates.joinDate.includes('-') && updates.joinDate.split('-').length === 3) {
        const [day, month, year] = updates.joinDate.split('-');
        updates.joinDate = new Date(year, month - 1, day);
      } else {
        updates.joinDate = new Date(updates.joinDate);
      }
    }
    
    const user = await User.findOneAndUpdate(
      { _id: id, isDeleted: false }, 
      updates, 
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error: any) {
    console.error('Update user error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Email already exists',
        field: 'email'
      });
    }
    
    res.status(400).json({ message: 'Error updating user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Soft delete: mark as deleted instead of removing
    const user = await User.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { 
        isDeleted: true, 
        deletedAt: new Date() 
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting user' });
  }
};

export const getUsersSummary = async (req: Request, res: Response) => {
  try {
    // Only count non-deleted users
    const totalUsers = await User.countDocuments({ isDeleted: false });
    const activeUsers = await User.countDocuments({ isActive: true, isDeleted: false });
    const inactiveUsers = totalUsers - activeUsers;

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};