const userService = require('../services/UserService');
const { validationResult } = require('express-validator');

class UserController {
    async register(req, res) {
        try {
            const user = await userService.createUser(req.body);
            res.status(201).json({
                message: 'User created successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await userService.login(email, password);
            res.json(result);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    async getProfile(req, res) {
        try {
            const user = await userService.getUserById(req.user.id);
            res.json({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async updateProfile(req, res) {
        try {
            const user = await userService.updateUser(req.user.id, req.body);
            res.json({
                message: 'Profile updated successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteProfile(req, res) {
        try {
            await userService.deleteUser(req.user.id);
            res.json({ message: 'Profile deleted successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateAvatar(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'Please upload an image' });
            }

            const user = await userService.updateAvatar(req.user.id, req.file);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new UserController(); 