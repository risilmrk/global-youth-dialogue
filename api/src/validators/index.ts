import { z } from 'zod';
import { ROLES } from '../constants/roles';

// Auth Validators
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Valid email address is required').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  country: z.string().min(2, 'Country is required'),
  organization: z.string().optional(),
  bio: z.string().max(500).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Valid email address is required').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const sendOtpSchema = z.object({
  email: z.string().email('Valid email address is required').toLowerCase().trim(),
  name: z.string().optional(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Valid email address is required').toLowerCase().trim(),
  otp: z.string().length(6, 'OTP code must be 6 digits'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Valid email address is required').toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

// Application Validators
export const createApplicationSchema = z.object({
  applicantName: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Valid email address is required').toLowerCase().trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  country: z.string().min(1, 'Country is required'),
  organization: z.string().optional().or(z.literal('')),
  experience: z.string().optional().or(z.literal('')),
  motivation: z.string().optional().or(z.literal('')),
  areasOfInterest: z.array(z.string()).min(1, 'Select at least one area of interest'),
  preferredLanguages: z.array(z.string()).optional(),
});

export const reviewApplicationSchema = z.object({
  status: z.enum(['pending', 'under_review', 'approved', 'rejected']),
  reviewNotes: z.string().optional(),
  assignRole: z.enum([ROLES.MEMBER, ROLES.PRESENTER, ROLES.COORDINATOR]).optional(),
  isApprovedPresenter: z.boolean().optional(),
});

export const presenterApplicationSchema = z.object({
  countryChapter: z.string().min(2, 'Country & Chapter Affiliation is required'),
  sphere: z.string().min(2, 'Primary Academic Sphere is required'),
  proposedTopic: z.string().min(3, 'Proposed Topic or Thesis is required'),
  experience: z.string().min(10, 'Academic, public speaking, or debate background is required'),
  dossierUrl: z.string().optional().or(z.literal('')),
  preferredFormat: z.string().optional(),
  statementOfIntent: z.string().min(10, 'Statement of Intent is required'),
});

// Session Validators
export const createSessionSchema = z.object({
  title: z.string().min(3, 'Title is required').max(200),
  titleAr: z.string().optional(),
  description: z.string().min(10, 'Description is required'),
  descriptionAr: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  categoryNameAr: z.string().optional(),
  format: z.string().optional(),
  formatAr: z.string().optional(),
  motion: z.string().optional(),
  scheduledAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Valid ISO date string is required',
  }),
  durationMinutes: z.number().int().positive().default(90),
  timezone: z.string().default('UTC'),
  meetingUrl: z.string().url().optional().or(z.literal('')),
  recordingUrl: z.string().url().optional().or(z.literal('')),
  recordingVisibility: z.enum(['public', 'members_only', 'private']).default('members_only'),
  presenters: z
    .array(
      z.object({
        userId: z.string().optional(),
        name: z.string().min(1),
        role: z.string().optional(),
        country: z.string().optional(),
      })
    )
    .default([]),
  propositionTeam: z.array(z.string()).optional(),
  oppositionTeam: z.array(z.string()).optional(),
  moderator: z.string().optional(),
  adjudicator: z.string().optional(),
  discussionQuestions: z.array(z.string()).optional(),
  workingDraftTitle: z.string().optional(),
  assignedCoordinator: z.string().optional(),
  assignedCoordinatorId: z.string().optional(),
});

export const updateSessionSchema = createSessionSchema.partial().extend({
  status: z.enum(['draft', 'scheduled', 'live', 'completed', 'cancelled']).optional(),
});

// Topic Validators
export const createTopicSchema = z.object({
  title: z.string().min(3, 'Title is required').max(250),
  titleAr: z.string().optional(),
  description: z.string().min(5, 'Description is required'),
  descriptionAr: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  subtopics: z.array(z.string()).optional(),
  subtopic: z.string().optional(),
  motion: z.string().optional(),
  format: z.string().optional(),
  regionalPerspective: z.string().optional(),
  sources: z.string().optional(),
  isCustom: z.boolean().optional(),
  interestedToPresent: z.boolean().optional(),
});

export const updateTopicStatusSchema = z.object({
  status: z.enum(['proposed', 'reviewing', 'shortlisted', 'approved', 'published', 'scheduled', 'completed', 'rejected']).optional(),
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  motion: z.string().optional(),
  format: z.string().optional(),
  subtopic: z.string().optional(),
  reviewNotes: z.string().optional(),
  assignedCoordinatorId: z.string().optional(),
  relatedSessionId: z.string().optional(),
});

// Feedback Validators
export const submitFeedbackSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  presentationId: z.string().optional(),
  recipientPresenterId: z.string().optional(),
  ratings: z.object({
    argumentation: z.number().min(1).max(5),
    evidence: z.number().min(1).max(5),
    delivery: z.number().min(1).max(5),
    engagement: z.number().min(1).max(5),
  }),
  strengths: z.string().min(5, 'Please provide constructive strengths'),
  improvements: z.string().min(5, 'Please provide areas of improvement'),
  missingPerspectives: z.string().optional(),
  futureTopicSuggestions: z.string().optional(),
  privateNotes: z.string().optional(),
  visibility: z.enum(['presenter_and_staff', 'staff_only', 'public']).default('presenter_and_staff'),
});

// Publication Validators
export const createPublicationSchema = z.object({
  title: z.string().min(3, 'Title is required').max(300),
  titleAr: z.string().optional(),
  slug: z.string().min(3).max(150).optional(),
  abstract: z.string().min(20, 'Abstract is required'),
  abstractAr: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  authors: z
    .array(
      z.object({
        name: z.string().min(1),
        nameAr: z.string().optional(),
        country: z.string().min(1),
        role: z.string().optional(),
        affiliation: z.string().optional(),
      })
    )
    .min(1, 'At least one author is required'),
  sections: z
    .array(
      z.object({
        title: z.string().min(1),
        titleAr: z.string().optional(),
        content: z.string().min(1),
        contentAr: z.string().optional(),
      })
    )
    .optional(),
  content: z.string().optional(),
  contentAr: z.string().optional(),
  coverImage: z.string().optional(),
  documentUrl: z.string().optional(),
  citation: z.string().optional(),
  status: z.enum(['draft', 'under_review', 'published', 'archived']).default('draft'),
  visibility: z.enum(['public', 'members_only']).default('public'),
});

export const updatePublicationSchema = createPublicationSchema.partial();
