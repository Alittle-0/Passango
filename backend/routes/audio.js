// routes/audio.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { Readable } from 'stream';
import FormData from 'form-data';
import fetch from 'node-fetch';
import Audio from '../models/audio.js';
import dotenv from 'dotenv';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
dotenv.config();

// Configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /audio\/wav|audio\/mp3|audio\/mpeg/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only MP3 and WAV files are allowed'), false);
    }
  }
})

router.post('/upload-audio', upload.single('audio'), async (req, res) => {
  try {

    if (!req.file || !req.body.song) {
      return res.status(400).json({ message: 'Audio and song name are required' });
    }

    //Create FormData for get-chord API
    const chordFormData = new FormData();
    chordFormData.append('audio', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    console.log('Sending request to chord recognition service...');
    const chord_response = await fetch(
      `${process.env.PYTHON_PORT}/api/get-chord`,
      {
        method: "POST",
        headers: chordFormData.getHeaders(),
        body: chordFormData,
      }
    );
    
    console.log('Sending request to lyric recognition service...');
    const lyric_response = await fetch(
      `${process.env.PYTHON_PORT}/api/get-lyrics`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ song: req.body.song }),
      }
    );
    
    const lyric_data = await lyric_response.json();
    const chord_data = await chord_response.json();
    
    // Check for errors in API responses
    if (!lyric_response.ok) {
      return res.status(lyric_response.status).json({ message: lyric_data.error || 'Failed to fetch lyrics' });
    }
    if (!chord_response.ok) {
      return res.status(chord_response.status).json({ message: chord_data.error || 'Failed to fetch chords' });
    }


    // Create a new FormData for the final upload
    const audioBase64 = req.file.buffer.toString('base64');
    const responseData = {
      audio: audioBase64,
      mimetype: req.file.mimetype,
      lyrics: lyric_data.lyrics,
      song: lyric_data.song,
      artist: lyric_data.artist,
      chords: chord_data.results.chords,
      tempo: chord_data.results.tempo,
      key: chord_data.results.key
    };

    // Save to MongoDB
    const audioDoc = new Audio(responseData);
    await audioDoc.save();

    // Send response with MongoDB document ID
    res.status(200).json({
      ...responseData,
      _id: audioDoc._id
    });
  } catch (error) {
    console.error('Error uploading audio:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;