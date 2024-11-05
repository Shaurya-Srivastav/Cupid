// src/models/Goal.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface GoalDocument extends Document {
  title: string;
  date: Date;
  trophies: number;
  badge: string;
}

const GoalSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    trophies: { type: Number, required: true },
    badge: { type: String, required: true },
  },
  { timestamps: true }
);

const Goal = mongoose.model<GoalDocument>('Goal', GoalSchema);
export default Goal;
