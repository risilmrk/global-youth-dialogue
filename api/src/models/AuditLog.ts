import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  performedBy: {
    userId?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    role: string;
  };
  targetType: 'user' | 'application' | 'session' | 'topic' | 'publication' | 'system';
  targetId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true, index: true },
    performedBy: {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      email: { type: String, required: true },
      role: { type: String, required: true },
    },
    targetType: {
      type: String,
      enum: ['user', 'application', 'session', 'topic', 'publication', 'system'],
      required: true,
      index: true,
    },
    targetId: { type: String },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Append-only
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

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
