import User from '../models/User.js';
import { validateEmail, validatePassword, comparePassword, generateToken } from '../utils/helpers.js';
import { v2 as cloudinary } from 'cloudinary';
import { promisify } from 'util';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = promisify(cloudinary.uploader.upload);

class UserService {
    async createUser(userData) {
        if (!validateEmail(userData.email)) {
            throw new Error('Invalid email format');
        }

        if (!validatePassword(userData.password)) {
            throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
        }

        if (!userData.username || userData.username.length < 3) {
            throw new Error('Username is required and must be at least 3 characters long');
        }

        // Check for existing email
        const existingEmail = await User.findOne({ email: userData.email });
        if (existingEmail) {
            throw new Error('Email already in use');
        }

        // Check for existing username
        const existingUsername = await User.findOne({ username: userData.username });
        if (existingUsername) {
            throw new Error('Username already taken');
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);

        // Create user with proper username field
        return await User.create(userData);
    }

    async login(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Generate access token (short-lived, 24h)
        const accessToken = generateToken(user);
        
        // Generate refresh token (long-lived, 7 days)
        const refreshToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        // Update user's last login time
        user.lastLogin = new Date();
        await user.save();

        return { 
            user, 
            accessToken, 
            refreshToken 
        };
    }

    async getUserById(id) {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async updateUser(id, userData) {
        const user = await this.getUserById(id);
        
        if (userData.email && userData.email !== user.email) {
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('Email already in use');
            }
        }

        return await User.findByIdAndUpdate(id, userData, { new: true });
    }

    async deleteUser(id) {
        const user = await this.getUserById(id);
        await User.findByIdAndDelete(id);
        return { message: 'User deleted successfully' };
    }

    async updateAvatar(userId, file) {
        try {
            // Upload image to Cloudinary
            const result = await uploadImage(file.path, {
                folder: 'passango/avatars',
                width: 500,
                height: 500,
                crop: 'fill',
                gravity: 'face'
            });

            // Update user's avatar URL
            const user = await User.findByIdAndUpdate(
                userId,
                { avatar: result.secure_url },
                { new: true, runValidators: true }
            );

            if (!user) {
                throw new Error('User not found');
            }

            return user;
        } catch (error) {
            throw new Error(`Failed to update avatar: ${error.message}`);
        }
    }
}

const userService = new UserService();
export default userService;

/*
The UserService.js file provides user-related functionality for your application:

1 User Management:
Create users with validation for email, password, and username
User login with authentication
Get user by ID
Update user information
Delete users

2 Profile Features:
Upload and update user avatars using Cloudinary
Process profile images (cropping, resizing)

3Validation:
Email format checking
Password complexity requirements
Username length verification
Duplicate email/username prevention 
*/