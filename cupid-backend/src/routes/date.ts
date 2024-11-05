// src/routes/date.ts

import express from 'express';
import {
  generateDate,
  getDateById,
  updateJournalEntry,
} from '../controllers/dateController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/generate', authenticateToken, generateDate);
router.get('/:dateId', authenticateToken, getDateById);
router.put('/:dateId/journal', authenticateToken, updateJournalEntry);

export default router;
