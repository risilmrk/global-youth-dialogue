import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const otpRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // 5 OTP dispatches per window
  message: {
    success: false,
    error: 'Too many verification code requests. Please wait before requesting another OTP.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200,
  message: {
    success: false,
    error: 'Rate limit exceeded. Please slow down your requests.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
