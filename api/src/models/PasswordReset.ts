import mongoose, { Document, Schema } from 'mongoose';

export interface IPasswordReset extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const PasswordResetSchema = new Schema<IPasswordReset>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    used: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const PasswordReset = mongoose.model<IPasswordReset>('PasswordReset', PasswordResetSchema);
