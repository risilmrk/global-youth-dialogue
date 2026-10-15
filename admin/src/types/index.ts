export type UserRole = 'MEMBER' | 'PRESENTER' | 'COORDINATOR' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'pending' | 'active' | 'suspended' | 'disabled';
  emailVerified: boolean;
  avatar?: string;
  bio?: string;
  country?: string;
  organization?: string;
  interests?: string[];
  createdAt: string;
  lastLoginAt?: string;
}

export interface Application {
  id: string;
  applicantName: string;
  email: string;
  country: string;
  organization?: string;
  experience: string;
  motivation: string;
  areasOfInterest: string[];
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'deleted';
  reviewedBy?: {
    id: string;
    name: string;
    email: string;
  };
  reviewedAt?: string;
  reviewNotes?: string;
  isApprovedPresenter?: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface DialogueSession {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  category: string;
  format?: string;
  motion?: string;
  scheduledAt: string;
  durationMinutes: number;
  timezone: string;
  status: 'draft' | 'scheduled' | 'live' | 'completed' | 'cancelled';
  meetingUrl?: string;
  recordingUrl?: string;
  recordingVisibility: 'public' | 'members_only' | 'private';
  presenters: Array<{
    userId?: string;
    name: string;
    role?: string;
    country?: string;
  }>;
  propositionTeam?: string[];
  oppositionTeam?: string[];
  moderator?: string;
  adjudicator?: string;
}

export interface Topic {
  id: string;
  title: string;
  titleAr?: string;
  slug: string;
  description: string;
  descriptionAr?: string;
  category: string;
  subtopics?: string[];
  proposedBy?: {
    userId?: string;
    name: string;
    country?: string;
  };
  assignedCoordinator?: {
    id: string;
    name: string;
  };
  status: 'proposed' | 'reviewing' | 'shortlisted' | 'approved' | 'scheduled' | 'completed' | 'rejected';
  reviewNotes?: string;
  createdAt: string;
}

export interface Publication {
  id: string;
  title: string;
  titleAr?: string;
  slug: string;
  abstract: string;
  abstractAr?: string;
  authors: Array<{
    name: string;
    country: string;
    role?: string;
  }>;
  sections?: Array<{
    title: string;
    content: string;
  }>;
  category: string;
  status: 'draft' | 'under_review' | 'published' | 'archived';
  visibility: 'public' | 'members_only';
  publishedAt?: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  sessionId: {
    id: string;
    title: string;
    category: string;
  };
  submittedBy: {
    userId: string;
    name: string;
    country?: string;
  };
  ratings: {
    argumentation: number;
    evidence: number;
    delivery: number;
    engagement: number;
  };
  strengths: string;
  improvements: string;
  missingPerspectives?: string;
  visibility: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: {
    userId: string;
    name: string;
    email: string;
    role: string;
  };
  targetType: string;
  targetId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalMembers: number;
  activePresenters: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  upcomingSessions: number;
  completedSessions: number;
  topicsInReview: number;
  publishedPapers: number;
  recentActivity: AuditLog[];
  applicationsByCountry: Array<{ country: string; count: number }>;
  sessionsTrend: Array<{ month: string; count: number }>;
}
