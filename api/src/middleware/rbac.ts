import { Request, Response, NextFunction } from 'express';
import { UserRole, Permission, hasPermission, ROLES } from '../constants/roles';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError(`Requires one of roles: ${roles.join(', ')}`));
    }

    next();
  };
}

export function requirePermission(permission: Permission) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (!hasPermission(req.user.role, permission)) {
      return next(new ForbiddenError(`Missing permission: ${permission}`));
    }

    next();
  };
}

export function requireVerifiedEmail(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new UnauthorizedError());
  }

  if (!req.user.emailVerified && req.user.role !== ROLES.SUPER_ADMIN && req.user.role !== ROLES.ADMIN) {
    return next(new ForbiddenError('Please verify your email address to access this feature'));
  }

  next();
}
