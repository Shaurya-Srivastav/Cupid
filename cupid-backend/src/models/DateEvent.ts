// src/models/DateEvent.ts

import mongoose, { Document, Schema } from 'mongoose';

interface ItineraryItem {
  name: string;
  position: [number, number];
  description: string;
  rating: number;
  cost: number;
  busy: boolean;
  imageUrl: string;
}

interface JournalEntry {
  locationName: string;
  notes?: string;
  photos?: string[];
}

export interface DateEventDocument extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  itinerary: ItineraryItem[];
  journalEntries: JournalEntry[];
}

const ItineraryItemSchema = new Schema<ItineraryItem>({
  name: { type: String, required: true },
  position: { type: [Number], required: true },
  description: { type: String },
  rating: { type: Number },
  cost: { type: Number },
  busy: { type: Boolean },
  imageUrl: { type: String },
});

const JournalEntrySchema = new Schema<JournalEntry>({
  locationName: { type: String, required: true },
  notes: { type: String },
  photos: [{ type: String }],
});

const DateEventSchema = new Schema<DateEventDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  itinerary: [ItineraryItemSchema],
  journalEntries: [JournalEntrySchema],
});

const DateEvent = mongoose.model<DateEventDocument>('DateEvent', DateEventSchema);
export default DateEvent;
