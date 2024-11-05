// src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader); // Log the header
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Extracted Token:', token); // Log the token
  const accessTokenSecret = process.env.JWT_SECRET || '';

  if (!token) {
    res.status(401).json({ message: 'Access token missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, accessTokenSecret) as JwtPayload;

    // Assuming the JWT payload contains a property named 'id'
    req.userId = decoded.id as string;

    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Invalid access token' });
  }
};
