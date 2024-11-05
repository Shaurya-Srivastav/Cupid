// src/types/express/index.d.ts

import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Optional if not always present
      // You can add more properties if needed, for example:
      user?: string | JwtPayload;
    }
  }
}
