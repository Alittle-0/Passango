// index.js
import dotenv from 'dotenv';
dotenv.config();
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***' : undefined);
import express from 'express';
import connect from './config/db.js';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import audioRoutes from './routes/audio.js';
import path from 'path';
import { fileURLToPath } from 'url';




// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug: Log the current directory
console.log('Current directory:', __dirname);

// Load environment variables from .env file with explicit path
const envPath = path.resolve(__dirname, '.env');
console.log('Looking for .env file at:', envPath);
dotenv.config({ path: envPath });

// Debug: Log environment variables to ensure they are loaded
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('NODE_PORT:', process.env.NODE_PORT);
console.log('PYTHON_PORT:', process.env.PYTHON_PORT);

// Check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in the .env file');
  process.exit(1); // Exit the process with an error code
}


const app = express();
// Configure CORS
app.use(cors({
  origin: '*', // Allow all origins during development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/audio', audioRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

// Add a root route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the PassanGo Backend API! Use /api/auth or /api/audio endpoints.');
});

// Multer for file uploads
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '.file')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, uniqueSuffix.file.originalname)
  }
})

const upload = multer({ storage: storage })

app.post('upload-audio', upload.single('audio'), async (req, res) => {
  try {
    console.log('File uploaded:', req.file);
    res.json({ message: 'File uploaded successfully', file: req.file });
  } catch (error) {
    console.error('Error processing file:', error);
    return res.status(500).json({ message: 'Error processing file' });
  }
});

// Connect to MongoDB
connect();

// Start the server
const PORT = process.env.NODE_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});