import express from 'express';
import userController from '../controllers/UserController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.delete('/profile', authMiddleware, userController.deleteProfile);

export default router;

/*
The userRoutes.js file defines API routes for user management :

Public Routes (no authentication required):
/register (POST): Create a new user account
/login (POST): Authenticate a user and get access token

Protected Routes (authentication required):
/profile (GET): Retrieve the current user's profile information
/profile (PUT): Update the current user's profile information
/profile (DELETE): Delete the current user's account
*/