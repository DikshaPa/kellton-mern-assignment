import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '../src/middleware/auth';
import User from '../src/models/User';

const app = express();
app.use(express.json());

// Test route
app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'Access granted' });
});

describe('JWT Authentication', () => {
  let testUser: any;
  let validToken: string;

  beforeEach(async () => {
    testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      googleId: 'google123',
      role: 'editor',
      department: 'IT',
      phoneNumber: '+1234567890',
    });
    await testUser.save();

    validToken = jwt.sign(
      { userId: testUser._id },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  it('should allow access with valid token', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Access granted');
  });

  it('should deny access without token', async () => {
    const response = await request(app).get('/protected');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access denied. No token provided.');
  });

  it('should deny access with invalid token', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid token.');
  });
});