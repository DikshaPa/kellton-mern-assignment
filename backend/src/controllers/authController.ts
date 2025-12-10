import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }

    const { sub: googleId, email, name } = payload;

    // Check for existing user by googleId or email
    let user = await User.findOne({ 
      $or: [{ googleId }, { email }] 
    });

    if (!user) {
      user = new User({
        name: name || 'Unknown User',
        email: email || '',
        googleId,
        role: 'viewer',
        department: 'IT',
        phoneNumber: '+1234567890',
        isActive: true,
      });
      await user.save();
    } else if (!user.googleId) {
      // Update existing user with googleId if missing
      user.googleId = googleId;
      await user.save();
    }

    // Check if user is inactive before proceeding
    if (!user.isActive) {
      return res.status(401).json({ 
        message: 'Your account has been deactivated. Please contact administrator.',
        code: 'USER_INACTIVE'
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.json({
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};