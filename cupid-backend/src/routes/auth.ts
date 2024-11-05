// src/routes/auth.ts
import express from 'express';
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
} from '../controllers/authController';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);

export default router;
