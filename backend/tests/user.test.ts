import request from 'supertest';
import express from 'express';
import User from '../src/models/User';

const app = express();
app.use(express.json());

describe('User Model', () => {
  it('should create a user with all required fields', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      googleId: 'google123',
      role: 'editor',
      department: 'IT',
      phoneNumber: '+1234567890',
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.role).toBe(userData.role);
    expect(savedUser.department).toBe(userData.department);
    expect(savedUser.isActive).toBe(true);
  });

  it('should fail validation for missing required fields', async () => {
    const user = new User({});
    
    await expect(user.save()).rejects.toThrow();
  });
});