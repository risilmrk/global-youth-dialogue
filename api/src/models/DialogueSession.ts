import mongoose, { Document, Schema } from 'mongoose';
import { SessionStatus, RecordingVisibility } from '../types';

export interface IDialogueSession extends Document {
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  category: string;
  categoryNameAr?: string;
  format?: string;
  formatAr?: string;
  motion?: string;
  scheduledAt: Date;
  durationMinutes: number;
  timezone: string;
  status: SessionStatus;
  meetingUrl?: string;
  recordingUrl?: string;
  recordingVisibility: RecordingVisibility;
  presenters: Array<{
    userId?: mongoose.Types.ObjectId;
    name: string;
    role?: string;
    country?: string;
  }>;
  propositionTeam?: string[];
  oppositionTeam?: string[];
  moderator?: string;
  adjudicator?: string;
  discussionQuestions?: string[];
  workingDraftTitle?: string;
  assignedCoordinator?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DialogueSessionSchema = new Schema<IDialogueSession>(
  {
    title: { type: String, required: true, trim: true },
    titleAr: { type: String, default: '' },
    description: { type: String, required: true },
    descriptionAr: { type: String, default: '' },
    category: { type: String, required: true, index: true },
    categoryNameAr: { type: String, default: '' },
    format: { type: String, default: 'Oxford Parliamentary Debate' },
    formatAr: { type: String, default: '' },
    motion: { type: String, default: '' },
    scheduledAt: { type: Date, required: true, index: true },
    durationMinutes: { type: Number, default: 90 },
    timezone: { type: String, default: 'UTC' },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'live', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    meetingUrl: { type: String, default: '' },
    recordingUrl: { type: String, default: '' },
    recordingVisibility: {
      type: String,
      enum: ['public', 'members_only', 'private'],
      default: 'members_only',
    },
    presenters: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, required: true },
        role: { type: String, default: 'Speaker' },
        country: { type: String, default: '' },
      },
    ],
    propositionTeam: [{ type: String }],
    oppositionTeam: [{ type: String }],
    moderator: { type: String, default: '' },
    adjudicator: { type: String, default: '' },
    discussionQuestions: [{ type: String }],
    workingDraftTitle: { type: String, default: '' },
    assignedCoordinator: { type: Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
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

export const DialogueSession = mongoose.model<IDialogueSession>('DialogueSession', DialogueSessionSchema);
