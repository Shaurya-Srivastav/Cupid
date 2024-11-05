// src/app.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// Import all models to ensure they're registered with Mongoose
import './models/User';
import './models/CompletedGoal';

import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import accountRoutes from './routes/account';
import dateRoutes from './routes/date';
import uploadRoutes from './routes/upload';
import goalRoutes from './routes/goal';

import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173', // Update this to your frontend URL
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/date', dateRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/goals', goalRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
