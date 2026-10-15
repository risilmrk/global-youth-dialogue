import { Request, Response, NextFunction } from 'express';
import { Publication } from '../models/Publication';
import { sendSuccess } from '../utils/response';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { ROLES } from '../constants/roles';
import { logAuditEvent } from '../utils/audit';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function listPublications(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 12;
    const category = req.query.category as string;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const isStaff = req.user?.role === ROLES.ADMIN || req.user?.role === ROLES.SUPER_ADMIN || req.user?.role === ROLES.COORDINATOR;

    const query: any = {};
    if (!isStaff) {
      query.status = 'published';
      if (!req.user) {
        query.visibility = 'public';
      }
    } else if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { abstract: { $regex: search, $options: 'i' } },
        { 'authors.name': { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Publication.countDocuments(query);
    const publications = await Publication.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return sendSuccess(res, publications, undefined, 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}

export async function getPublicationBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const publication = await Publication.findOne({ slug: req.params.slug });
    if (!publication) throw new NotFoundError('Publication not found');

    const isStaff = req.user?.role === ROLES.ADMIN || req.user?.role === ROLES.SUPER_ADMIN || req.user?.role === ROLES.COORDINATOR;

    if (!isStaff && publication.status !== 'published') {
      throw new NotFoundError('Publication is currently under review or draft');
    }

    if (!req.user && publication.visibility === 'members_only') {
      throw new BadRequestError('This publication is accessible to verified community members only. Please log in.');
    }

    return sendSuccess(res, publication);
  } catch (err) {
    next(err);
  }
}

export async function createPublication(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, titleAr, slug: customSlug, abstract, abstractAr, sections, content, contentAr, authors, category, coverImage, documentUrl, citation, status, visibility } = req.body;

    let baseSlug = customSlug ? slugify(customSlug) : slugify(title);
    if (!baseSlug) baseSlug = `paper-${Date.now()}`;

    let slug = baseSlug;
    let counter = 1;
    while (await Publication.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const publication = await Publication.create({
      title,
      titleAr: titleAr || '',
      slug,
      abstract,
      abstractAr: abstractAr || '',
      sections: sections || [],
      content: content || '',
      contentAr: contentAr || '',
      authors,
      category,
      coverImage: coverImage || '',
      documentUrl: documentUrl || '',
      citation: citation || '',
      status: status || 'draft',
      visibility: visibility || 'public',
      publishedAt: status === 'published' ? new Date() : undefined,
      createdBy: req.user!._id,
    });

    await logAuditEvent({
      action: 'PUBLICATION_CREATED',
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'publication',
      targetId: publication._id.toString(),
      details: { title: publication.title, slug: publication.slug, status: publication.status },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, publication, 'Academic research paper created', 201);
  } catch (err) {
    next(err);
  }
}

export async function updatePublication(req: Request, res: Response, next: NextFunction) {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) throw new NotFoundError('Publication not found');

    if (req.body.status === 'published' && publication.status !== 'published') {
      publication.publishedAt = new Date();
    }

    Object.assign(publication, req.body);
    await publication.save();

    await logAuditEvent({
      action: 'PUBLICATION_UPDATED',
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'publication',
      targetId: publication._id.toString(),
      details: req.body,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, publication, 'Publication updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function deletePublication(req: Request, res: Response, next: NextFunction) {
  try {
    const publication = await Publication.findByIdAndDelete(req.params.id);
    if (!publication) throw new NotFoundError('Publication not found');

    await logAuditEvent({
      action: 'PUBLICATION_DELETED',
      performedBy: {
        userId: req.user!._id,
        name: req.user!.name,
        email: req.user!.email,
        role: req.user!.role,
      },
      targetType: 'publication',
      targetId: req.params.id as string,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    return sendSuccess(res, null, 'Publication deleted successfully');
  } catch (err) {
    next(err);
  }
}
