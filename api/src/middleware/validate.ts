import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { BadRequestError } from '../utils/errors';

export function validate(schema: AnyZodObject) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req.body);
      req.body = parsed;
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        err.errors.forEach((e) => {
          const key = e.path.join('.') || 'body';
          if (!errors[key]) errors[key] = [];
          errors[key].push(e.message);
        });
        const combinedMessage = Object.values(errors).flat().join('. ');
        return next(new BadRequestError(combinedMessage || 'Validation failed', errors));
      }
      next(err);
    }
  };
}
