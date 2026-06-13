const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  resendVerification,
  googleLogin,
  forgotPassword,
  resetPassword,
  getProfile,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Rate Limiting Middleware for Auth Routes
// Limit login/register/reset requests to 10 attempts per 15-minute window
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

// Routes
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/verify/:token', verifyEmail);
router.post('/resend-verification', authLimiter, resendVerification);
router.post('/google-login', authLimiter, googleLogin);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

// Profile endpoint (Requires JWT validation via authMiddleware)
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
