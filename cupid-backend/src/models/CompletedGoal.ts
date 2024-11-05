// src/models/CompletedGoal.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface CompletedGoalDocument extends Document {
  userId: mongoose.Types.ObjectId; // Reference to User
  goalId: mongoose.Types.ObjectId; // Reference to Goal
  title: string;
  description?: string;
  dateCompleted: Date;
  rewardPoints: number;
}

const CompletedGoalSchema: Schema<CompletedGoalDocument> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    goalId: { type: Schema.Types.ObjectId, ref: 'Goal', required: true },
    title: { type: String, required: true },
    description: { type: String },
    dateCompleted: { type: Date, default: Date.now },
    rewardPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const CompletedGoal = mongoose.model<CompletedGoalDocument>('CompletedGoal', CompletedGoalSchema);
export default CompletedGoal;
