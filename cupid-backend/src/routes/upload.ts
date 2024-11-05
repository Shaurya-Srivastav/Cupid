// src/routes/upload.ts

import express from 'express';
import { uploadImage, getImage } from '../controllers/uploadController';
import { authenticateToken } from '../middleware/auth';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI || '',
  file: (req, file) => {
    return {
      filename: 'file_' + Date.now(),
      bucketName: 'uploads',
    };
  },
});

const upload = multer({ storage });

router.post('/', authenticateToken, upload.single('file'), uploadImage);
router.get('/:filename', getImage);

export default router;
