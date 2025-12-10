import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import mongoose from 'mongoose';
import User from '../models/User';

const router = Router();

// Get system status
router.get('/status', authenticate, async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    const totalUsers = await User.countDocuments({ isDeleted: false });
    const activeUsers = await User.countDocuments({ isActive: true, isDeleted: false });
    
    // Calculate activity rate
    const activityRate = totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0;
    
    // System uptime
    const uptime = process.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    
    res.json({
      system: {
        status: 'Online',
        uptime: `${uptimeHours}h ${uptimeMinutes}m`,
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
        }
      },
      database: {
        status: dbStatus,
        collections: mongoose.connection.db?.collections?.length || 0
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        activityRate: `${activityRate}%`
      },
      services: {
        api: 'Running',
        auth: 'Running',
        email: 'Running'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get system status' });
  }
});

export default router;