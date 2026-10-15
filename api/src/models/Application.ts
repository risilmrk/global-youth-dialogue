import mongoose, { Document, Schema } from 'mongoose';
import { ApplicationStatus } from '../types';

export interface IApplication extends Document {
  applicantName: string;
  email: string;
  password?: string;
  country: string;
  flag?: string;
  organization?: string;
  experience: string;
  motivation: string;
  areasOfInterest: string[];
  preferredLanguages: string[];
  status: ApplicationStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reviewNotes?: string;
  linkedUser?: mongoose.Types.ObjectId;
  isApprovedPresenter?: boolean;
  presenterProposal?: {
    countryChapter: string;
    sphere: string;
    proposedTopic: string;
    experience: string;
    dossierUrl?: string;
    preferredFormat?: string;
    statementOfIntent: string;
    appliedAt: Date;
    status: 'pending' | 'approved' | 'rejected';
  };
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    applicantName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    password: { type: String },
    country: { type: String, required: true },
    flag: { type: String, default: 'INT' },
    organization: { type: String, default: '' },
    experience: { type: String, default: '' },
    motivation: { type: String, default: '' },
    areasOfInterest: [{ type: String }],
    preferredLanguages: [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected', 'deleted'],
      default: 'pending',
      index: true,
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    reviewNotes: { type: String, default: '' },
    linkedUser: { type: Schema.Types.ObjectId, ref: 'User' },
    isApprovedPresenter: { type: Boolean, default: false },
    presenterProposal: {
      countryChapter: { type: String },
      sphere: { type: String },
      proposedTopic: { type: String },
      experience: { type: String },
      dossierUrl: { type: String },
      preferredFormat: { type: String },
      statementOfIntent: { type: String },
      appliedAt: { type: Date },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    },
    emailVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        delete ret.password;
        delete ret.__v;
        ret.id = ret._id?.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);
