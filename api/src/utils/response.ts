import { Response } from 'express';

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200,
  meta?: { page?: number; limit?: number; total?: number; totalPages?: number }
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: Record<string, string[]>
) {
  return res.status(statusCode).json({
    success: false,
    error: message,
    errors,
  });
}
