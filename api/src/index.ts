import app from './app';
import { connectDatabase } from './config/database';
import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    await connectDatabase();
  } catch (err: any) {
    console.error('Database connection error in serverless handler:', err?.message || err);
    return res.status(503).json({
      success: false,
      error: `Database connection failed. Please ensure MONGODB_URI is configured in Vercel Environment Variables and MongoDB Atlas Network Access allows 0.0.0.0/0. Details: ${err?.message || err}`,
    });
  }
  return app(req, res);
}

export { app };
