import mongoose, { Document, Schema } from 'mongoose';
import { TopicStatus } from '../types';

export interface ITopic extends Document {
  title: string;
  titleAr?: string;
  slug: string;
  description: string;
  descriptionAr?: string;
  category: string;
  subtopics: string[];
  motion?: string;
  format?: string;
  subtopic?: string;
  regionalPerspective?: string;
  sources?: string;
  isCustom?: boolean;
  interestedToPresent?: boolean;
  proposedBy?: {
    userId?: mongoose.Types.ObjectId;
    name: string;
    email?: string;
    country?: string;
  };
  assignedCoordinator?: mongoose.Types.ObjectId;
  status: TopicStatus;
  reviewNotes?: string;
  relatedSession?: mongoose.Types.ObjectId;
  upvotesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TopicSchema = new Schema<ITopic>(
  {
    title: { type: String, required: true, trim: true },
    titleAr: { type: String, default: '' },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    descriptionAr: { type: String, default: '' },
    category: { type: String, required: true, index: true },
    subtopics: [{ type: String }],
    motion: { type: String, default: '' },
    format: { type: String, default: 'Academic Discussion / Policy Roundtable' },
    subtopic: { type: String, default: '' },
    regionalPerspective: { type: String, default: '' },
    sources: { type: String, default: '' },
    isCustom: { type: Boolean, default: false },
    interestedToPresent: { type: Boolean, default: false },
    proposedBy: {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      name: { type: String },
      email: { type: String },
      country: { type: String },
    },
    assignedCoordinator: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['proposed', 'reviewing', 'shortlisted', 'approved', 'published', 'scheduled', 'completed', 'rejected'],
      default: 'proposed',
      index: true,
    },
    reviewNotes: { type: String, default: '' },
    relatedSession: { type: Schema.Types.ObjectId, ref: 'DialogueSession' },
    upvotesCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        delete ret.__v;
        ret.id = ret._id?.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

export const Topic = mongoose.model<ITopic>('Topic', TopicSchema);
