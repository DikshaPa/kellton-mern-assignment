import { sendWelcomeEmail } from '../src/services/emailService';
import nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');
const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;

describe('Email Service', () => {
  let mockTransporter: any;

  beforeEach(() => {
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' })
    };
    
    mockedNodemailer.createTransporter.mockReturnValue(mockTransporter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send welcome email with correct content', async () => {
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      role: 'editor'
    };

    await sendWelcomeEmail(testUser);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_FROM,
      to: testUser.email,
      subject: 'Welcome to Dynamic Dashboard',
      html: expect.stringContaining(testUser.name)
    });
  });

  it('should handle email sending errors gracefully', async () => {
    mockTransporter.sendMail.mockRejectedValue(new Error('SMTP Error'));
    
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      role: 'editor'
    };

    // Should not throw error
    await expect(sendWelcomeEmail(testUser)).resolves.not.toThrow();
  });
});