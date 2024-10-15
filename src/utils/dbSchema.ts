import { Schema, model, Document } from 'mongoose';
import { Theme, defaultTheme } from './theme';

// ... (keep existing interfaces and schemas)

interface IFloorPlan extends Document {
  name: string;
  imageUrl: string;
  franchise: string;
}

const floorPlanSchema = new Schema<IFloorPlan>({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  franchise: { type: Schema.Types.ObjectId, ref: 'Franchise', required: true },
});

export const FloorPlan = model<IFloorPlan>('FloorPlan', floorPlanSchema);

interface ICase extends Document {
  title: string;
  description: string;
  status: 'open' | 'in progress' | 'closed';
  createdAt: Date;
  assignedTo: string;
  updates: Array<{ user: string; content: string; createdAt: Date }>;
  files: Array<{ name: string; type: string; uploadedAt: Date; uploadedBy: string }>;
  franchise: string;
  floorPlan?: string;
  incidentLocation?: { x: number; y: number };
}

const caseSchema = new Schema<ICase>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'in progress', 'closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  updates: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  files: [{
    name: String,
    type: String,
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  }],
  franchise: { type: Schema.Types.ObjectId, ref: 'Franchise', required: true },
  floorPlan: { type: Schema.Types.ObjectId, ref: 'FloorPlan' },
  incidentLocation: {
    x: Number,
    y: Number
  }
});

export const Case = model<ICase>('Case', caseSchema);

// ... (keep other existing exports)