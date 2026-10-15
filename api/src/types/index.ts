import { UserRole } from '../constants/roles';

export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'deleted';
export type SessionStatus = 'draft' | 'scheduled' | 'live' | 'completed' | 'cancelled';
export type RecordingVisibility = 'public' | 'members_only' | 'private';
export type TopicStatus = 'proposed' | 'reviewing' | 'shortlisted' | 'approved' | 'published' | 'scheduled' | 'completed' | 'rejected';
export type PublicationStatus = 'draft' | 'under_review' | 'published' | 'archived';
export type PublicationVisibility = 'public' | 'members_only';

export interface UserDTO {
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
  languages?: string[];
  department?: string;
  interests?: string[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
