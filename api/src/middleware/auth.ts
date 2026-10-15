import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { UnauthorizedError } from '../utils/errors';
import { User, IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      tokenPayload?: TokenPayload;
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new UnauthorizedError('Please log in to continue'));
    }

    const payload = verifyToken(token);
    const user = await User.findById(payload.userId);

    if (!user || user.status === 'suspended' || user.status === 'disabled') {
      return next(new UnauthorizedError('Your account is inactive or not found'));
    }

    req.user = user;
    req.tokenPayload = payload;
    next();
  } catch (err: any) {
    return next(new UnauthorizedError('Session expired or invalid. Please log in again.'));
  }
}

export async function optionalAuthenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const payload = verifyToken(token);
      const user = await User.findById(payload.userId);
      if (user && user.status === 'active') {
        req.user = user;
        req.tokenPayload = payload;
      }
    }
  } catch (e) {}
  next();
}
