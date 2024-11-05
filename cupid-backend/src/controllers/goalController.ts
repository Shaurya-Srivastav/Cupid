// src/controllers/goalController.ts
import { RequestHandler } from 'express';
import Goal from '../models/Goal';
import Joi from 'joi';
import { generateRandomGoal } from '../utils/goalGenerator';

// Define interfaces for request bodies
interface CreateGoalRequestBody {
  title: string;
  date: string; // or Date, adjust according to your schema
  trophies: number;
  badge: string;
}

// Validation schema using Joi
const goalSchema = Joi.object({
  title: Joi.string().required(),
  date: Joi.date().required(),
  trophies: Joi.number().required(),
  badge: Joi.string().required(),
});

export const getGoals: RequestHandler = async (req, res, next) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (error) {
    console.error('Error in getGoals:', error);
    next(error);
  }
};

export const createGoal: RequestHandler<{}, {}, CreateGoalRequestBody> = async (
  req,
  res,
  next
) => {
  const { error } = goalSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  const { title, date, trophies, badge } = req.body;

  try {
    const goal = new Goal({ title, date, trophies, badge });
    await goal.save();
    res.json({ message: 'Goal created successfully' });
  } catch (error) {
    console.error('Error in createGoal:', error);
    next(error);
  }
};

export const generateGoals: RequestHandler = async (req, res, next) => {
  try {
    const generatedGoals = generateRandomGoal(10); // Generate 10 random goals
    const savedGoals = await Goal.insertMany(generatedGoals);
    res.json(savedGoals);
  } catch (error) {
    console.error('Error in generateGoals:', error);
    next(error);
  }
};

export const deleteAllGoals: RequestHandler = async (req, res, next) => {
  try {
    await Goal.deleteMany();
    res.status(200).json({ message: 'All goals deleted successfully' });
  } catch (error) {
    console.error('Error in deleteAllGoals:', error);
    next(error);
  }
};