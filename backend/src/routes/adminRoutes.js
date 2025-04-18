import express from 'express';
import { requireRole } from '../middleware/auth.js';
import userController from '../controllers/UserController.js';

const router = express.Router();

// All routes in this file require 'admin' role
router.use(requireRole('admin'));

// Admin user management routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Add more admin-specific routes here

export default router;