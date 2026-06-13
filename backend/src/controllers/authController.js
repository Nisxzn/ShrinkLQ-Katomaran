const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dns = require('dns').promises;
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { sendVerificationEmail, sendResetPasswordEmail } = require('../utils/mailer');
const { parseUserAgent } = require('../utils/userAgent');
const { verifyEmailExists } = require('../utils/emailVerifier');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Common domain typos for popular providers
const DOMAIN_TYPOS = {
  'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com', 'gmaill.com': 'gmail.com', 'gmail.co': 'gmail.com',
  'gmil.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gamail.com': 'gmail.com',
  'gmail.con': 'gmail.com', 'gmail.om': 'gmail.com', 'gmail.cm': 'gmail.com',
  'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'yhaoo.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com', 'yahoo.con': 'yahoo.com',
  'outlok.com': 'outlook.com', 'outllook.com': 'outlook.com', 'outlook.co': 'outlook.com',
  'hotmal.com': 'hotmail.com', 'hotmai.com': 'hotmail.com', 'hotmial.com': 'hotmail.com',
  'hotmail.co': 'hotmail.com', 'hotmail.con': 'hotmail.com',
};

// Provider-specific minimum local part length
const STRICT_PROVIDERS = {
  'gmail.com': 6,
  'yahoo.com': 3,
  'outlook.com': 3,
  'hotmail.com': 3,
  'yahoo.co.in': 3,
  'outlook.in': 3,
};

// DNS-based domain validation to check if email domain exists and can receive emails
const validateEmailDomain = async (email) => {
  try {
    const domain = email.split('@')[1];
    const lowerDomain = domain.toLowerCase();
    console.log('Checking MX records for domain:', domain);

    // Check for known domain typos first
    if (DOMAIN_TYPOS[lowerDomain]) {
      console.log(`Domain typo detected: ${lowerDomain} -> ${DOMAIN_TYPOS[lowerDomain]}`);
      return { valid: false, suggestion: DOMAIN_TYPOS[lowerDomain] };
    }

    // Check minimum local part length for popular providers
    const localPart = email.split('@')[0];
    const minLength = STRICT_PROVIDERS[lowerDomain];
    if (minLength) {
      const cleanLocal = localPart.replace(/\./g, '');
      if (cleanLocal.length < minLength) {
        console.log(`Local part too short for ${lowerDomain}: ${cleanLocal.length} < ${minLength}`);
        return { valid: false, reason: `${domain} requires at least ${minLength} characters before the @` };
      }
    }
    
    // Check for MX records
    const mxRecords = await dns.resolveMx(domain);
    
    if (!mxRecords || mxRecords.length === 0) {
      console.log('No MX records found for domain:', domain);
      return { valid: false, reason: 'This email domain cannot receive emails' };
    }
    
    console.log('MX records found for domain:', domain, mxRecords);
    return { valid: true };
  } catch (error) {
    console.log('DNS lookup failed for email domain:', error.message);
    // Fail-closed: reject emails when we can't verify the domain
    return { valid: false, reason: 'Could not verify the email domain. Please check the email address and try again.' };
  }
};

// Email Regex Validation - Strict pattern to catch invalid formats
const isValidEmail = (email) => {
  console.log('Validating email:', email);
  
  // Check if email exists and is a string
  if (!email || typeof email !== 'string') {
    console.log('Email is empty or not a string');
    return false;
  }
  
  // Trim whitespace
  const trimmedEmail = email.trim();
  if (trimmedEmail !== email) {
    console.log('Email has leading/trailing whitespace');
    return false;
  }
  
  // Check for exactly one @ symbol
  const atCount = (email.match(/@/g) || []).length;
  if (atCount !== 1) {
    console.log('Email does not have exactly one @ symbol');
    return false;
  }
  
  // Strict email validation pattern
  const emailRegex = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
  
  // Additional checks
  if (!emailRegex.test(email)) {
    console.log('Email does not match strict regex pattern');
    return false;
  }
  
  // Check for consecutive dots
  if (email.includes('..')) {
    console.log('Email contains consecutive dots');
    return false;
  }
  
  // Check for dot at start or end of local part
  const [localPart, domain] = email.split('@');
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    console.log('Local part starts or ends with dot');
    return false;
  }
  
  // Check for dot at start or end of domain
  if (domain.startsWith('.') || domain.endsWith('.')) {
    console.log('Domain starts or ends with dot');
    return false;
  }
  
  // Check domain has at least one dot
  if (!domain.includes('.')) {
    console.log('Domain does not contain a dot');
    return false;
  }
  
  // Check TLD is at least 2 characters
  const tld = domain.split('.').pop();
  if (tld.length < 2) {
    console.log('TLD is less than 2 characters');
    return false;
  }
  
  // Check for common disposable email domains (optional - can be extended)
  const disposableDomains = ['tempmail.com', 'throwaway.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com'];
  if (disposableDomains.some(d => domain.toLowerCase().endsWith(d))) {
    console.log('Email uses disposable domain');
    return false;
  }
  
  console.log('Email validation passed');
  return true;
};

// Password Strength Validation
// Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
const isStrongPassword = (password) => {
  if (password.length < 8) return false;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return hasUppercase && hasLowercase && hasNumber && hasSpecial;
};

// Helper to record login history
const recordLogin = async (user, req) => {
  try {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
    // Normalize IP address (remove IPv6 prefix if local)
    const ip = rawIp === '::1' ? '127.0.0.1' : rawIp.replace(/^.*:/, '');
    
    const userAgentStr = req.headers['user-agent'];
    const { browser, device } = parseUserAgent(userAgentStr);

    const loginEntry = {
      ip,
      browser,
      device,
      timestamp: new Date(),
    };

    user.loginHistory = user.loginHistory || [];
    user.loginHistory.unshift(loginEntry);

    // Keep only the last 10 logins
    if (user.loginHistory.length > 10) {
      user.loginHistory.pop();
    }

    await user.save();
  } catch (error) {
    console.error('Error logging login history:', error.message);
  }
};

// 1. REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format. Please provide a valid email address.',
      });
    }

    // Validate email domain has MX records and check for typos
    const domainCheck = await validateEmailDomain(email);
    if (!domainCheck.valid) {
      const [localPart] = email.split('@');
      return res.status(400).json({
        success: false,
        message: domainCheck.suggestion
          ? `Did you mean ${localPart}@${domainCheck.suggestion}?`
          : domainCheck.reason || 'The email domain does not exist or cannot receive emails. Please check the email address and try again.',
      });
    }

    // Connect to mail server to check if SMTP mailbox exists
    const smtpCheck = await verifyEmailExists(email);
    if (!smtpCheck.valid) {
      return res.status(400).json({
        success: false,
        message: smtpCheck.reason || 'This email address does not exist. Please enter a real email address.',
      });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password using bcrypt with salt rounds 12
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: true, // Automatically verified since SMTP verifier checked its existence
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful! Your email has been verified. You can now log in.',
    });
  } catch (error) {
    console.error('Registration server error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

// 2. LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Enforce email verification
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Your email address is not verified. Please verify your email before logging in.',
        unverified: true,
      });
    }

    // Record login in history
    await recordLogin(user, req);

    // Generate 7-day JWT Token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error('Login server error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

// 3. EMAIL VERIFICATION
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required',
      });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Verification link is invalid or has expired. Please request a new one.',
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email address verified successfully! You can now log in.',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification',
    });
  }
};

// 4. RESEND VERIFICATION
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format. Please provide a valid email address.',
      });
    }

    // Validate email domain has MX records and check for typos
    const domainCheck = await validateEmailDomain(email);
    if (!domainCheck.valid) {
      const [localPart] = email.split('@');
      return res.status(400).json({
        success: false,
        message: domainCheck.suggestion
          ? `Did you mean ${localPart}@${domainCheck.suggestion}?`
          : domainCheck.reason || 'The email domain does not exist or cannot receive emails. Please check the email address and try again.',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'No user account found with this email',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'This email is already verified',
      });
    }

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send email
    await sendVerificationEmail(user.email, verificationToken);

    res.status(200).json({
      success: true,
      message: 'Verification email resent successfully.',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error when resending verification email',
    });
  }
};

// 5. GOOGLE SIGN IN
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required',
      });
    }

    // Verify Google ID Token
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google authentication token',
      });
    }

    const { email, name } = payload;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Google login failed: email not shared',
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create account automatically
      // Set a random secure password hash
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 12);

      user = new User({
        name,
        email,
        password: hashedPassword,
        isVerified: true, // Google verified emails are trusted
      });

      await user.save();
    }

    // Google accounts trust email implicitly, force verify if existing user wasn't verified
    if (!user.isVerified) {
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save();
    }

    // Record login
    await recordLogin(user, req);

    // Sign 7d JWT Token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Google Sign In successful',
      data: {
        token,
        user: {
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error('Google Auth server error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google authentication',
    });
  }
};

// 6. FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format. Please provide a valid email address.',
      });
    }

    // Validate email domain has MX records and check for typos
    const domainCheck = await validateEmailDomain(email);
    if (!domainCheck.valid) {
      const [localPart] = email.split('@');
      return res.status(400).json({
        success: false,
        message: domainCheck.suggestion
          ? `Did you mean ${localPart}@${domainCheck.suggestion}?`
          : domainCheck.reason || 'The email domain does not exist or cannot receive emails. Please check the email address and try again.',
      });
    }

    const user = await User.findOne({ email });
    // For security, do not explicitly confirm user exists or doesn't exist
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been sent.',
      });
    }

    // Generate Reset Token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour expiration
    await user.save();

    // Send reset email
    await sendResetPasswordEmail(user.email, resetToken);

    res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset request',
    });
  }
};

// 7. RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset link is invalid or has expired.',
      });
    }

    // Hash new password using 12 salt rounds
    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully! You can now log in.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset',
    });
  }
};

// 8. GET PROFILE & LOGIN HISTORY
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        loginHistory: user.loginHistory || [],
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile details',
    });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
  googleLogin,
  forgotPassword,
  resetPassword,
  getProfile,
};
