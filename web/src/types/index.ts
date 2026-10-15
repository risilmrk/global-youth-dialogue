export type UserRole = 'member' | 'presenter' | 'coordinator' | 'admin' | 'super_admin' | 'MEMBER' | 'PRESENTER' | 'COORDINATOR' | 'ADMIN' | 'SUPER_ADMIN';


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
  flag?: string;
  organization?: string;
  interests?: string[];
  department?: string;
  createdAt: string;
}

export interface DialogueSession {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  category: string;
  categoryNameAr?: string;
  format?: string;
  formatAr?: string;
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
  discussionQuestions?: string[];
  assignedCoordinator?: string | { id?: string; _id?: string; name?: string; email?: string; role?: string };
  createdBy?: string | { id?: string; _id?: string; name?: string; email?: string };
}

export interface Topic {
  id: string;
  title: string;
  titleAr?: string;
  slug?: string;
  description: string;
  descriptionAr?: string;
  category: string;
  subtopics?: string[];
  subtopic?: string;
  motion?: string;
  format?: string;
  regionalPerspective?: string;
  sources?: string;
  isCustom?: boolean;
  interestedToPresent?: boolean;
  assignedCoordinator?: string | { id?: string; _id?: string; name?: string; email?: string; role?: string };
  upvotesCount?: number;
  proposedBy?: {
    userId?: string;
    name: string;
    country?: string;
  };
  status: 'proposed' | 'reviewing' | 'shortlisted' | 'approved' | 'published' | 'scheduled' | 'completed' | 'rejected';
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
  content?: string;
  contentAr?: string;
  author?: {
    name: string;
    nameAr?: string;
    country: string;
    role?: string;
  };
  sections?: Array<{
    title: string;
    titleAr?: string;
    content: string;
    contentAr?: string;
  }>;
  authors: Array<{
    name: string;
    nameAr?: string;
    country: string;
    role?: string;
    affiliation?: string;
  }>;
  category: string;
  coverImage?: string;
  documentUrl?: string;
  citation?: string;
  status: 'draft' | 'under_review' | 'published' | 'archived';
  visibility: 'public' | 'members_only';
  publishedAt?: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  sessionId: string;
  sessionTitle?: string;
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
  futureTopicSuggestions?: string;
  createdAt: string;
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
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  reviewNotes?: string;
  isApprovedPresenter?: boolean;
  emailVerified: boolean;
  createdAt: string;
}
