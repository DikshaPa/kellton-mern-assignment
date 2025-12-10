import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Temporary bypass for testing
    if (token === 'test-jwt-token-for-development') {
      // Create a fake user for testing
      req.user = {
        _id: 'test-user-id',
        name: 'Diksha Pandey',
        email: 'diksha.pandey@kellton.com',
        role: 'admin',
        isActive: true,
        department: 'IT',
        phoneNumber: '+1234567890'
      } as any;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    // Check if user is inactive
    if (!user.isActive) {
      return res.status(401).json({ 
        message: 'Account deactivated. Please contact administrator.',
        code: 'USER_INACTIVE'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};