const nodemailer = require('nodemailer');

// Initialize SMTP Transporter using Gmail
const createTransporter = () => {
  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn('⚠️ Gmail email credentials missing in .env. Falling back to terminal mail logging.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || 'noreply@shortly.com';

  if (!transporter) {
    // Development Logger fallback
    console.log('\n=================== 📨 DEV EMAIL LOG ===================');
    console.log(`To:      ${to}`);
    console.log(`From:    ${from}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body (Text):\n${text}`);
    console.log('========================================================\n');
    return true;
  }

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    return true;
  } catch (error) {
    console.error('❌ Failed to send email via SMTP:', error.message);
    throw error;
  }
};

const sendVerificationEmail = async (email, token) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verificationLink = `${frontendUrl}/verify-email?token=${token}`;

  const subject = 'Verify your Shortly account';
  const text = `Please verify your email address by clicking on this link: ${verificationLink}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #E8357C; text-align: center;">Welcome to Shortly!</h2>
      <p>Thank you for signing up. Please verify your email address to activate your account:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="background-color: #E8357C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
      </div>
      <p>Or copy and paste this URL into your browser:</p>
      <p style="font-family: monospace; word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 5px;">${verificationLink}</p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">This link will expire in 24 hours.</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html, text });
};

const sendResetPasswordEmail = async (email, token) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${frontendUrl}/reset-password?token=${token}`;

  const subject = 'Reset your Shortly password';
  const text = `Reset your password by clicking on this link: ${resetLink}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #E8357C; text-align: center;">Reset Your Password</h2>
      <p>We received a request to reset your password. Click the button below to set a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #E8357C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>
      <p>Or copy and paste this URL into your browser:</p>
      <p style="font-family: monospace; word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 5px;">${resetLink}</p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">If you didn't request a password reset, you can safely ignore this email. This link will expire in 1 hour.</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html, text });
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
};
