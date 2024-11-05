// src/interfaces/AuthenticatedRequest.ts

import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}
