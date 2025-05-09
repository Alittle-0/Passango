import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB Connection
const uri = process.env.MONGO_URI;
console.log('Connecting to MongoDB at:', uri);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define schema (matching both potential models)
const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  createdAt: Date
});

// Create model (will work with existing collections)
const User = mongoose.model('User', userSchema, 'users'); // Try the standard collection name

// Function to find all users
const findAllUsers = async () => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude passwords for security
    console.log('Total users found:', users.length);
    console.log('Users:');
    users.forEach(user => {
      console.log('-------------------');
      console.log('Username:', user.username);
      console.log('Email:', user.email);
      console.log('Created:', user.createdAt);
      console.log('ID:', user._id);
    });
  } catch (error) {
    console.error('Error finding users:', error);
  } finally {
    mongoose.connection.close();
  }
};

findAllUsers();