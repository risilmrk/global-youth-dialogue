import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  sessionId: mongoose.Types.ObjectId;
  presentationId?: string;
  submittedBy: {
    userId: mongoose.Types.ObjectId;
    name: string;
    country?: string;
  };
  recipientPresenter?: {
    userId?: mongoose.Types.ObjectId;
    name: string;
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
  privateNotes?: string;
  visibility: 'presenter_and_staff' | 'staff_only' | 'public';
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'DialogueSession', required: true, index: true },
    presentationId: { type: String, default: '' },
    submittedBy: {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      country: { type: String, default: '' },
    },
    recipientPresenter: {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      name: { type: String },
    },
    ratings: {
      argumentation: { type: Number, required: true, min: 1, max: 5 },
      evidence: { type: Number, required: true, min: 1, max: 5 },
      delivery: { type: Number, required: true, min: 1, max: 5 },
      engagement: { type: Number, required: true, min: 1, max: 5 },
    },
    strengths: { type: String, required: true },
    improvements: { type: String, required: true },
    missingPerspectives: { type: String, default: '' },
    futureTopicSuggestions: { type: String, default: '' },
    privateNotes: { type: String, default: '' },
    visibility: {
      type: String,
      enum: ['presenter_and_staff', 'staff_only', 'public'],
      default: 'presenter_and_staff',
    },
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

export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);
