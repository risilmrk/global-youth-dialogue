import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User';
import { Application } from '../models/Application';
import { EmailVerification } from '../models/EmailVerification';
import { PasswordReset } from '../models/PasswordReset';
import { hashPassword, verifyPassword, hashOtp, generateOtp, generateTokenString } from '../utils/password';
import { signToken } from '../utils/jwt';
import { BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError } from '../utils/errors';
import { sendEmail } from '../config/email';
import { ROLES, UserRole } from '../constants/roles';
import { sendSuccess } from '../utils/response';
import { logAuditEvent } from '../utils/audit';
import { env } from '../config/env';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? ('none' as const) : ('lax' as const),
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function sendOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, name } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const rawOtp = generateOtp();
    const hashed = hashOtp(rawOtp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await EmailVerification.deleteMany({ email: normalizedEmail });

    await EmailVerification.create({
      email: normalizedEmail,
      otpHash: hashed,
      expiresAt,
      attempts: 0,
    });

    const subject = 'Your GYDE Verification Code';
    const text = `Hello ${name || 'Applicant'},\n\nYour GYDE 6-digit verification code is: ${rawOtp}\n\nThis code will expire in 10 minutes.\n\nGlobal Youth Dialogue & Exchange (GYDE)`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0E4D3C; margin-top: 0;">Global Youth Dialogue & Exchange</h2>
        <p>Hello <strong>${name || 'Applicant'}</strong>,</p>
        <p>Your one-time email verification code is:</p>
        <div style="background: #F7FAF9; border: 1px dashed #0E4D3C; border-radius: 6px; padding: 16px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0E4D3C; margin: 20px 0;">
          ${rawOtp}
        </div>
        <p style="color: #64748b; font-size: 14px;">This code is valid for 10 minutes and can only be used once. If you did not request this code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">GYDE — Qatar ISDC7 Founded Youth Dialogue Community</p>
      </div>
    `;

    await sendEmail({ to: normalizedEmail, subject, text, html });
    const devOtp = env.NODE_ENV !== 'production' ? rawOtp : undefined;
    return sendSuccess(res, { devOtp }, 'Verification code dispatched to your email address');
  } catch (err) {
    next(err);
  }
}

export async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const verification = await EmailVerification.findOne({ email: normalizedEmail });

    if (!verification) {
      throw new BadRequestError('No active verification code found for this email. Please request a new one.');
    }

    if (new Date() > verification.expiresAt) {
      await EmailVerification.deleteOne({ _id: verification._id });
      throw new BadRequestError('Verification code has expired. Please request a new one.');
    }

    if (verification.attempts >= 5) {
      await EmailVerification.deleteOne({ _id: verification._id });
      throw new BadRequestError('Too many failed verification attempts. Please request a new code.');
    }

    const hashedInput = hashOtp(otp);
    if (hashedInput !== verification.otpHash) {
      verification.attempts += 1;
      await verification.save();
      throw new BadRequestError('Invalid verification code');
    }

    await EmailVerification.deleteOne({ _id: verification._id });
    await User.updateOne({ email: normalizedEmail }, { emailVerified: true });
    await Application.updateMany({ email: normalizedEmail }, { emailVerified: true });

    return sendSuccess(res, null, 'Email address verified successfully');
  } catch (err) {
    next(err);
  }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, country, organization, bio } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      throw new BadRequestError('An account with this email already exists.');
    }

    const passwordHash = await hashPassword(password);

    const approvedApp = await Application.findOne({
      email: normalizedEmail,
      status: 'approved',
    });

    const role: UserRole = approvedApp?.isApprovedPresenter ? ROLES.PRESENTER : ROLES.MEMBER;

    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      role,
      status: 'active',
      emailVerified: approvedApp?.emailVerified || false,
      country,
      organization: organization || '',
      bio: bio || '',
    });

    if (approvedApp) {
      approvedApp.linkedUser = user._id as any;
      await approvedApp.save();
    }

    const token = signToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    res.cookie('token', token, COOKIE_OPTIONS);

    await logAuditEvent({
      action: 'USER_REGISTERED',
      performedBy: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      targetType: 'user',
      targetId: user._id.toString(),
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, { user, token }, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status === 'suspended' || user.status === 'disabled') {
      throw new UnauthorizedError('Your account has been deactivated. Please contact support.');
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Enforce role and portal separation
    const clientApp = ((req.headers['x-client-app'] as string) || '').toLowerCase();
    const origin = req.get('origin') || req.get('referer') || '';
    const isWebClient = clientApp === 'web' || origin.includes(env.WEB_ORIGIN) || origin.includes('5173');
    const isAdminClient = clientApp === 'admin' || origin.includes(env.ADMIN_ORIGIN) || origin.includes('5174');

    const userRole = (user.role || '').toLowerCase();
    const isStaffAdmin = userRole === 'admin' || userRole === 'super_admin';

    // Administrator accounts cannot log in to the Member Website
    if (isWebClient && isStaffAdmin) {
      throw new ForbiddenError('Administrator accounts cannot log in to the Member Website. Please sign in via the Admin Portal.');
    }

    // Admin panel is strictly restricted to Administrators
    if (isAdminClient && !isStaffAdmin) {
      throw new ForbiddenError('Access denied: The Admin Panel is strictly restricted to platform administrators.');
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    res.cookie('token', token, COOKIE_OPTIONS);

    await logAuditEvent({
      action: 'USER_LOGGED_IN',
      performedBy: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      targetType: 'user',
      targetId: user._id.toString(),
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, { user, token }, 'Logged in successfully');
  } catch (err) {
    next(err);
  }
}

export async function logout(_req: Request, res: Response, _next: NextFunction) {
  res.clearCookie('token', COOKIE_OPTIONS);
  return sendSuccess(res, null, 'Logged out successfully');
}

export async function getMe(req: Request, res: Response, _next: NextFunction) {
  const user = req.user;
  const clientApp = req.headers['x-client-app'];
  const origin = req.get('origin') || req.get('referer') || '';
  const isWebClient = clientApp === 'web' || origin.includes(env.WEB_ORIGIN) || origin.includes('5173');

  if (isWebClient && (user?.role === ROLES.ADMIN || user?.role === ROLES.SUPER_ADMIN)) {
    res.clearCookie('token', COOKIE_OPTIONS);
    return res.status(403).json({
      success: false,
      error: 'Administrator accounts cannot access the Member Website. Please sign in via the Admin Portal.',
    });
  }

  return sendSuccess(res, { user });
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const normalizedEmail = req.body.email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (user) {
      const rawToken = generateTokenString();
      const tokenHash = hashOtp(rawToken);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await PasswordReset.create({
        userId: user._id,
        tokenHash,
        expiresAt,
      });

      const resetUrl = `http://localhost:5173/reset-password?token=${rawToken}`;
      const subject = 'GYDE Password Reset Request';
      const text = `Hello ${user.name},\n\nYou requested a password reset for your GYDE account. Use this token: ${rawToken}\n\nOr click: ${resetUrl}\n\nValid for 1 hour.`;
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 24px;">
          <h2>Password Reset</h2>
          <p>Hello ${user.name},</p>
          <p>You requested a password reset. Click the button below to choose a new password:</p>
          <a href="${resetUrl}" style="background: #0E4D3C; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Reset Password</a>
          <p>Or use token: <code>${rawToken}</code></p>
          <p style="color: #64748b; font-size: 13px;">This link will expire in 60 minutes.</p>
        </div>
      `;

      await sendEmail({ to: normalizedEmail, subject, text, html });
    }

    return sendSuccess(res, null, 'If that email exists in our records, a password reset link has been dispatched.');
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, newPassword } = req.body;
    const tokenHash = hashOtp(token);
    const resetRecord = await PasswordReset.findOne({
      tokenHash,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      throw new BadRequestError('Invalid or expired password reset token');
    }

    const user = await User.findById(resetRecord.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    resetRecord.used = true;
    await resetRecord.save();

    return sendSuccess(res, null, 'Password reset successful. You may now log in with your new credentials.');
  } catch (err) {
    next(err);
  }
}
