// src/models/DateEvent.ts

import mongoose, { Document, Schema } from 'mongoose';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface ItineraryItem {
  name: string;
  coordinates: Coordinates; // Changed from [number, number] to Coordinates object
  description: string;
  rating: number;
  cost: number;
  busy: boolean;
  imageUrl: string;
  address: string; // Ensure address is included
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

const CoordinatesSchema = new Schema<Coordinates>({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const ItineraryItemSchema = new Schema<ItineraryItem>({
  name: { type: String, required: true },
  coordinates: { type: CoordinatesSchema, required: true }, // Updated field
  description: { type: String },
  rating: { type: Number },
  cost: { type: Number },
  busy: { type: Boolean },
  imageUrl: { type: String },
  address: { type: String }, // Added address field
});

const JournalEntrySchema = new Schema<JournalEntry>({
  locationName: { type: String, required: true },
  notes: { type: String },
  photos: [{ type: String }],
});

const DateEventSchema = new Schema<DateEventDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  itinerary: [ItineraryItemSchema], // Array of ItineraryItem
  journalEntries: [JournalEntrySchema], // Array of JournalEntry
});

const DateEvent = mongoose.model<DateEventDocument>('DateEvent', DateEventSchema);

export default DateEvent;
