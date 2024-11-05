// src/controllers/dashboardController.ts

import { Request, Response } from 'express';
import User from '../models/User';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const getDashboardData = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(400).json({ message: 'User ID is missing' });
      return;
    }

    const user = await User.findById(userId).populate('completedGoals');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const data = {
      stats: user.stats,
      completedGoals: user.completedGoals,
    };

    res.json(data);
  } catch (error) {
    console.error('Error in getDashboardData:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
