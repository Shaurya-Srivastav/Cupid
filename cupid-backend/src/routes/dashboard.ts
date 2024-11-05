// src/routes/dashboard.ts

import express from 'express';
import { getDashboardData } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Endpoint: GET /api/dashboard/
router.get('/', authenticateToken, getDashboardData);

export default router;
