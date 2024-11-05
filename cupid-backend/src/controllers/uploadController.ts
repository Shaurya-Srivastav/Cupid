// src/controllers/uploadController.ts

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../interfaces/AuthenticatedRequest';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || '';

mongoose.connect(mongoURI);

const connection = mongoose.connection;

let gfsBucket: GridFSBucket;

connection.once('open', () => {
  gfsBucket = new mongoose.mongo.GridFSBucket(connection.db!, {
    bucketName: 'uploads',
  });
});

export const uploadImage = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  res.json({ file: req.file });
};

export const getImage = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { filename } = req.params;

  if (!gfsBucket) {
    res.status(500).json({ message: 'Server Error' });
    return;
  }

  const downloadStream = gfsBucket.openDownloadStreamByName(filename);

  downloadStream.on('error', (err) => {
    res.status(404).json({ message: 'No file exists' });
  });

  downloadStream.pipe(res);
};
