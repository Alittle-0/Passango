import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connect() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the .env file");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export default connect;
