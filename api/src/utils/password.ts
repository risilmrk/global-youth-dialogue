import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateTokenString(): string {
  return crypto.randomBytes(32).toString('hex');
}
