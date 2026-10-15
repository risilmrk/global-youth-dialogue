import mongoose, { Document, Schema } from 'mongoose';

export interface IEmailVerification extends Document {
  email: string;
  otpHash: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

const EmailVerificationSchema = new Schema<IEmailVerification>(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // Auto TTL expiration
    attempts: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const EmailVerification = mongoose.model<IEmailVerification>('EmailVerification', EmailVerificationSchema);
