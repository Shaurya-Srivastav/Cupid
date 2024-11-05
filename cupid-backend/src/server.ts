// src/server.ts

import mongoose from 'mongoose';
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully.');
  await mongoose.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully.');
  await mongoose.disconnect();
  process.exit(0);
});
