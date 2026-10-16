import app from './app';
import { connectDatabase } from './config/database';
import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    await connectDatabase();
  } catch (err: any) {
    console.error('Database connection error in serverless handler:', err);
  }
  return app(req, res);
}

export { app };
