import mongoose, { Document, Schema } from 'mongoose';
import { PublicationStatus, PublicationVisibility } from '../types';

export interface IPublicationSection {
  title: string;
  titleAr?: string;
  content: string;
  contentAr?: string;
}

export interface IPublication extends Document {
  title: string;
  titleAr?: string;
  slug: string;
  abstract: string;
  abstractAr?: string;
  sections: IPublicationSection[];
  content?: string;
  contentAr?: string;
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
  status: PublicationStatus;
  visibility: PublicationVisibility;
  publishedAt?: Date;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PublicationSchema = new Schema<IPublication>(
  {
    title: { type: String, required: true, trim: true },
    titleAr: { type: String, default: '' },
    slug: { type: String, required: true, unique: true, index: true },
    abstract: { type: String, required: true },
    abstractAr: { type: String, default: '' },
    sections: [
      {
        title: { type: String, required: true },
        titleAr: { type: String, default: '' },
        content: { type: String, required: true },
        contentAr: { type: String, default: '' },
      },
    ],
    content: { type: String, default: '' },
    contentAr: { type: String, default: '' },
    authors: [
      {
        name: { type: String, required: true },
        nameAr: { type: String, default: '' },
        country: { type: String, required: true },
        role: { type: String, default: 'Author' },
        affiliation: { type: String, default: '' },
      },
    ],
    category: { type: String, required: true, index: true },
    coverImage: { type: String, default: '' },
    documentUrl: { type: String, default: '' },
    citation: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'under_review', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    visibility: {
      type: String,
      enum: ['public', 'members_only'],
      default: 'public',
      index: true,
    },
    publishedAt: { type: Date },
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

export const Publication = mongoose.model<IPublication>('Publication', PublicationSchema);
