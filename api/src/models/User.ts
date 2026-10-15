import mongoose, { Document, Schema } from 'mongoose';
import { ROLES, UserRole } from '../constants/roles';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
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
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.MEMBER,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended', 'disabled'],
      default: 'active',
      index: true,
    },
    emailVerified: { type: Boolean, default: false },
    avatar: { type: String },
    bio: { type: String, default: '' },
    country: { type: String, default: '' },
    flag: { type: String, default: 'INT' },
    organization: { type: String, default: '' },
    languages: [{ type: String }],
    department: { type: String, default: '' },
    interests: [{ type: String }],
    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        delete ret.passwordHash;
        delete ret.__v;
        ret.id = ret._id?.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
