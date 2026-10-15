import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { sendSuccess } from '../utils/response';
import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errors';
import { ROLES, UserRole } from '../constants/roles';
import { logAuditEvent } from '../utils/audit';

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 25;
    const role = req.query.role as string;
    const search = req.query.search as string;
    const isStaff = req.user?.role === ROLES.ADMIN || req.user?.role === ROLES.SUPER_ADMIN || req.user?.role === ROLES.COORDINATOR;

    const query: any = { status: { $ne: 'disabled' } };
    if (role && role !== 'all') {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
      ];
      if (isStaff) {
        query.$or.push({ email: { $regex: search, $options: 'i' } });
      }
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // If regular member browsing community directory, sanitize email
    const sanitized = users.map((u) => {
      const obj = u.toJSON();
      if (!isStaff) {
        delete (obj as any).email;
      }
      return obj;
    });

    return sendSuccess(res, sanitized, undefined, 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError('User not found');
    return sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const targetId = req.params.id || req.user!._id;
    const isSelf = req.user!._id.toString() === targetId.toString();
    const isStaff = req.user!.role === ROLES.ADMIN || req.user!.role === ROLES.SUPER_ADMIN;

    if (!isSelf && !isStaff) {
      throw new ForbiddenError('You can only update your own profile');
    }

    const user = await User.findById(targetId);
    if (!user) throw new NotFoundError('User not found');

    const allowedUpdates = ['name', 'bio', 'country', 'flag', 'organization', 'interests', 'languages', 'department'];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        (user as any)[field] = req.body[field];
      }
    });

    await user.save();
    return sendSuccess(res, user, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function updateUserStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError('User not found');

    // Protect super admin
    if (user.role === ROLES.SUPER_ADMIN && status !== 'active') {
      throw new BadRequestError('Cannot deactivate the Super Administrator account');
    }

    user.status = status;
    await user.save();

    await logAuditEvent({
      action: `USER_STATUS_${status.toUpperCase()}`,
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'user',
      targetId: user._id.toString(),
      details: { status },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, user, `User status updated to ${status}`);
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction) {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError('User not found');

    if (user.role === ROLES.SUPER_ADMIN && role !== ROLES.SUPER_ADMIN) {
      const superAdminCount = await User.countDocuments({ role: ROLES.SUPER_ADMIN });
      if (superAdminCount <= 1) {
        throw new BadRequestError('Cannot demote the only remaining Super Administrator');
      }
    }

    const prevRole = user.role;
    user.role = role as UserRole;
    await user.save();

    await logAuditEvent({
      action: 'USER_ROLE_CHANGED',
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'user',
      targetId: user._id.toString(),
      details: { previousRole: prevRole, newRole: role },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, user, `User role changed to ${role}`);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError('User not found');

    if (user.role === ROLES.SUPER_ADMIN) {
      throw new BadRequestError('Super Administrator cannot be deleted');
    }

    await User.findByIdAndDelete(req.params.id);

    await logAuditEvent({
      action: 'USER_DELETED',
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'user',
      targetId: req.params.id as string,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, null, 'User removed successfully');
  } catch (err) {
    next(err);
  }
}
