import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env from root or current folder
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform((v) => parseInt(v, 10)),
  API_PREFIX: z.string().default('/api/v1'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/gyde'),
  WEB_ORIGIN: z.string().default('http://localhost:5173'),
  ADMIN_ORIGIN: z.string().default('http://localhost:5174'),
  JWT_SECRET: z.string().min(16).default('gyde_dev_secret_key_change_in_production_min_32_chars'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SECRET: z.string().min(16).default('gyde_cookie_secret_dev_key_32_chars_minimum'),
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().default('465').transform((v) => parseInt(v, 10)),
  SMTP_SECURE: z.string().default('true').transform((v) => v === 'true'),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  FROM_EMAIL: z.string().default('thegyde.verify@gmail.com'),
  FROM_NAME: z.string().default('Global Youth Dialogue & Exchange (GYDE)'),
  INITIAL_ADMIN_EMAIL: z.string().email().default('3681mubashircp@gmail.com'),
  INITIAL_ADMIN_PASSWORD: z.string().default('368136'),
  INITIAL_ADMIN_NAME: z.string().default('Mubashir CP'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
