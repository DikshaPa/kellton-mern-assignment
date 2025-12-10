import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'diksha.pandey@kellton.com',
    pass: 'avzxgsdcerzmatus'  // New Gmail App Password
  }
});

console.log('Using Gmail with App Password');

export const sendWelcomeEmail = async (user: { name: string; email: string; role: string }) => {
  try {
    console.log('Attempting to send email to:', user.email);
    
    const mailOptions = {
      from: 'diksha.pandey@kellton.com',
      to: user.email,
      subject: 'Welcome to Dynamic Dashboard',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976d2;">Welcome to Dynamic Dashboard</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>You have been added as a <strong>${user.role}</strong> in Dynamic Dashboard.</p>
          <p>Please sign in using your Google account to access the system.</p>
          <div style="margin: 20px 0;">
            <a href="http://localhost:3000/login" 
               style="background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Access Dashboard
            </a>
            <p style="margin-top: 15px; font-size: 12px; color: #666;">
              Note: Use the same Google account (${user.email}) to sign in
            </p>
          </div>
          <p>Best regards,<br>Dynamic Dashboard Team</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully to:', user.email);
    console.log('Message ID:', result.messageId);
    console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(result));
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    console.error('Email config:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      from: process.env.EMAIL_FROM
    });
  }
};