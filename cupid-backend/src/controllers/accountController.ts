// src/controllers/accountController.ts

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../interfaces/AuthenticatedRequest';
import User from '../models/User';
import DateEvent from '../models/DateEvent';
import CompletedGoal from '../models/CompletedGoal';
import Goal from '../models/Goal';

// Controller to get account information
export const getAccountInfo = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(userId)
      .populate({
        path: 'dateHistory',
        model: 'DateEvent',
      })
      .populate({
        path: 'completedGoals',
        model: 'CompletedGoal',
        populate: {
          path: 'goalId',
          model: 'Goal',
        },
      });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      name: user.name,
      profile: user.profile,
      stats: user.stats,
      dateHistory: user.dateHistory,
      completedGoals: user.completedGoals,
    });
  } catch (error) {
    console.error('Error in getAccountInfo:', error);
    next(error);
  }
};

// Controller to update account information
export const updateAccountInfo = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { name, nickname, bio, avatar } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        profile: {
          nickname,
          bio,
          avatar,
        },
      },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error in updateAccountInfo:', error);
    next(error);
  }
};

// Controller to get completed goals for the user
export const getCompletedGoals = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const completedGoals = await CompletedGoal.find({ userId })
      .populate({
        path: 'goalId',
        model: 'Goal',
      })
      .exec();

    res.json(completedGoals);
  } catch (error) {
    console.error('Error in getCompletedGoals:', error);
    next(error);
  }
};

// Controller to get date history for the user
export const getDateHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const dateHistory = await DateEvent.find({ userId }).exec();

    res.json(dateHistory);
  } catch (error) {
    console.error('Error in getDateHistory:', error);
    next(error);
  }
};
