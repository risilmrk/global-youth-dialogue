import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger';
import { env } from '../config/env';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors;

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    message = `A record with this ${field} already exists.`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Database validation failed';
    errors = {};
    for (const key in err.errors) {
      errors[key] = [err.errors[key].message];
    }
  }

  // Handle CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID format: ${err.value}`;
  }

  if (statusCode >= 500) {
    logger.error({ err }, `[Unhandled Error] ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    errors,
    ...(env.NODE_ENV === 'development' && statusCode >= 500 ? { stack: err.stack } : {}),
  });
}
