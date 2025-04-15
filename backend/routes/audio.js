// routes/audio.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import ffmpeg from 'fluent-ffmpeg';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /mp3|wav/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only .mp3 and .wav files are allowed'));
  },
});

// Upload audio file
router.post('/upload', authMiddleware, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = `/uploads/${req.file.filename}`;

    // Extract metadata using fluent-ffmpeg
    ffmpeg.ffprobe(path.join(__dirname, '../uploads', req.file.filename), (err, metadata) => {
      if (err) {
        console.error('FFmpeg error:', err);
        return res.status(500).json({ message: 'Failed to process audio file', error: err.message });
      }

      const duration = metadata.format.duration; // Duration in seconds
      const bitrate = metadata.format.bit_rate; // Bitrate in bps
      const format = metadata.format.format_name; // File format

      res.status(200).json({
        message: 'File uploaded successfully',
        filePath,
        metadata: {
          duration,
          bitrate,
          format,
        },
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;