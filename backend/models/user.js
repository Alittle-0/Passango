// models/user.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { validatePassword } from '../src/utils/passwordValidator.js'; 

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ],
  },

  username: {
    type: String,
    required: [true, 'Please provide an username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  avatar: {
    type: String,
    // Will fix this later 
  },

  lastLogin: {
    type: Date
},

  loginAttempts: {
    type: Number,
    default: 0
  },

});

//Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) return next();
  
  try {
    // Validate password strength first
    const validationResult = validatePassword(this.password);
    if (!validationResult.isValid) {
      const error = new Error(validationResult.message);
      return next(error);
    }
    
    // If password is valid, hash it
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('comparePassword called with:', candidatePassword ? '***password provided***' : 'no password');
  console.log('Stored password hash:', this.password ? this.password.substring(0, 10) + '...' : 'no password hash');
  
  try {
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password comparison result:', result);
    return result;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

const User = mongoose.model('User', userSchema);

export default User;