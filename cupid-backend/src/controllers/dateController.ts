// src/controllers/dateController.ts

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../interfaces/AuthenticatedRequest';
import DateEvent from '../models/DateEvent';
import User from '../models/User';
import { generateItinerary } from '../utils/generateItinerary';
import mongoose from 'mongoose';

export const generateDate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { city, interests, budget, dateTime, transportMode } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: 'Invalid user ID' });
    return;
  }

  try {
    // Generate itinerary using the custom algorithm
    const itinerary = await generateItinerary(city, interests, budget);

    if (!itinerary || itinerary.length === 0) {
      res.status(500).json({
        message: 'Failed to generate a suitable itinerary. Please try again later.',
      });
      return;
    }

    // Create a new date event and save it to the database
    const dateEvent = new DateEvent({
      userId,
      date: new Date(dateTime),
      itinerary,
      transportMode,
    });
    await dateEvent.save();

    // Update the user's date history
    await User.findByIdAndUpdate(userId, {
      $push: { dateHistory: dateEvent._id },
      $inc: { 'stats.totalDatesPlanned': 1 },
    });

    res.status(201).json({ dateId: dateEvent._id });
  } catch (error: any) {
    console.error('Error in generateDate:', error);

    // Handle any other errors that might occur
    res.status(500).json({
      message: 'An error occurred while generating the date. Please try again later.',
    });
  }
};

export const getDateById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { dateId } = req.params;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(dateId)) {
    res.status(400).json({ message: 'Invalid date ID' });
    return;
  }

  try {
    // Find the date event with the given ID and user ID
    const dateEvent = await DateEvent.findOne({ _id: dateId, userId });

    if (!dateEvent) {
      res.status(404).json({ message: 'Date not found' });
      return;
    }

    res.json(dateEvent);
  } catch (error) {
    console.error('Error in getDateById:', error);
    next(error);
  }
};

export const updateJournalEntry = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { dateId } = req.params;
  const { journalEntries } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(dateId)) {
    res.status(400).json({ message: 'Invalid date ID' });
    return;
  }

  try {
    // Update the journal entries for the specific date event
    const dateEvent = await DateEvent.findOneAndUpdate(
      { _id: dateId, userId },
      { journalEntries },
      { new: true }
    );

    if (!dateEvent) {
      res.status(404).json({ message: 'Date not found' });
      return;
    }

    res.json({ message: 'Journal updated successfully' });
  } catch (error) {
    console.error('Error in updateJournalEntry:', error);
    next(error);
  }
};
