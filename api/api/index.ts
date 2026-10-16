import app from '../src/app';
import { connectDatabase } from '../src/config/database';
import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    await connectDatabase();
  } catch (err: any) {
    console.error('Failed to connect to database in serverless handler:', err);
  }
  return app(req, res);
}
