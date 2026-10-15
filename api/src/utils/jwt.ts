import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '../constants/roles';

export interface TokenPayload {
  userId: string;
  role: UserRole;
  email: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}
