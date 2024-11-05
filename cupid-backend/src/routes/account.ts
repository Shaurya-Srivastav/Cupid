// src/routes/account.ts

import express from 'express';
import {
  getAccountInfo,
  updateAccountInfo,
  getCompletedGoals,
  getDateHistory,
} from '../controllers/accountController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Route to get account information
router.get('/', authenticateToken, getAccountInfo);

// Route to update account information
router.put('/', authenticateToken, updateAccountInfo);

// Route to get completed goals of the user
router.get('/completed-goals', authenticateToken, getCompletedGoals);

// Route to get date history of the user
router.get('/date-history', authenticateToken, getDateHistory);

export default router;
