// src/controllers/authController.ts
import { RequestHandler } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const accessTokenSecret = process.env.JWT_SECRET || '';
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || '';

export const registerUser: RequestHandler = async (req, res, next) => {
  // Validation schema
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@$!%*?&#]).+$'))
      .required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate tokens
    const accessToken = jwt.sign({ id: user._id }, accessTokenSecret, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ id: user._id }, refreshTokenSecret, {
      expiresIn: '7d',
    });

    // Send refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ accessToken });
  } catch (err: unknown) {
    console.error('Error in registerUser:', err);
    next(err); // Pass the error to Express error handler
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  // Validation schema
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    // Generate tokens
    const accessToken = jwt.sign({ id: user._id }, accessTokenSecret, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ id: user._id }, refreshTokenSecret, {
      expiresIn: '7d',
    });

    // Send refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ accessToken });
  } catch (err: unknown) {
    console.error('Error in loginUser:', err);
    next(err); // Pass the error to Express error handler
  }
};

export const refreshToken: RequestHandler = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ message: 'Refresh token missing' });
    return;
  }

  jwt.verify(
    refreshToken,
    refreshTokenSecret,
    (err: jwt.VerifyErrors | null, user: any) => {
      if (err) {
        res.status(401).json({ message: 'Invalid refresh token' });
        return;
      }

      const accessToken = jwt.sign({ id: user.id }, accessTokenSecret, {
        expiresIn: '15m',
      });
      res.json({ accessToken });
    }
  );
};

export const logoutUser: RequestHandler = (req, res, next) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false, // Set to true in production
    sameSite: 'strict',
  });
  res.json({ message: 'Logged out successfully' });
};
