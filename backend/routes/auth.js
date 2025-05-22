// routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import { sendEmail } from "../src/utils/email.js";
import { passwordResetCodeTemplate } from "../src/utils/emailTemplates.js";
import {
  generateVerificationCode,
  storeVerificationCode,
  verifyCode,
} from "../src/utils/verificationCode.js";
import User from "../models/user.js";
import authMiddleware from "../middleware/auth.js";
import upload from "../src/middleware/upload.js";

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  try {
    console.log("Signup request received:", req.body);
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      console.log("Missing required fields");
      return res
        .status(400)
        .json({ message: "Email, username, and password are required" });
    }

    console.log("Checking for existing user:", email);
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log("User already exists:", existingUser.email);
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "Email already in use"
            : "Username already taken",
      });
    }

    console.log("Creating new user");
    // Remove manual password hashing - let the mongoose pre-save hook handle it
    const user = new User({
      email,
      username,
      password, // Use plain password - it will be hashed by the pre-save hook
    });
    await user.save();

    console.log("Generating JWT token");
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const response = {
      token,
      user: user.email,
    };
    console.log("Sending response:", response);
    res.status(201).json(response);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password");
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    console.log("Finding user with email:", email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Comparing password for user:", email);
    if (!user.password) {
      console.log("User password is undefined");
      return res.status(500).json({ message: "User password is not set" });
    }

    // Use the comparePassword method from the user model instead of direct bcrypt compare
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Generating JWT token for user:", email);
    if (!process.env.JWT_SECRET) {
      console.log("JWT_SECRET is not defined");
      return res
        .status(500)
        .json({
          message: "Server configuration error: JWT_SECRET is not defined",
        });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Login successful for user:", email);
    res.status(200).json({
      token,
      user: { email: user.email, username: user.username, avatar: user.avatar },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get user profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update user profile
router.post("/profile", authMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return res
        .status(400)
        .json({
          message:
            "At least one field (email or password) is required to update",
        });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (password) {
      // Let pre-save hook handle password hashing
      user.password = password;
    }

    await user.save();

    res
      .status(200)
      .json({
        message: "Profile updated successfully",
        user: { email: user.email },
      });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Request password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate verification code
    const code = generateVerificationCode();
    storeVerificationCode(email, code);

    // Get user's name or use email if username doesn't exist
    const userName = user.username || user.name || email.split("@")[0];

    // Send email with verification code
    await sendEmail({
      to: user.email,
      subject: "Password Reset Verification - PassanGo",
      html: passwordResetCodeTemplate(userName, code),
    });

    res.status(200).json({ message: "Verification code sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Verify code route
router.post("/verify-code", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }
    const result = verifyCode(email, code); // This should ideally be an async operation if it involves DB/Redis in future
    if (!result.valid) {
      return res.status(400).json({ message: result.message });
    }
    // Issue a temporary token valid for 10 minutes
    const tempToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    res.json({ message: "Code verified successfully", tempToken });
  } catch (error) {
    console.error("Verify code error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { tempToken, newPassword } = req.body;

    if (!tempToken || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verification error:", err);
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const email = decoded.email;
    if (!email) {
      return res.status(400).json({ message: "Token does not contain email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword; // Will be hashed by pre-save hook in User model
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

// Upload avatar
router.post(
  "/upload-avatar",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const avatarBase64 = req.file.buffer.toString("base64");
      // Update user's avatar field with the filename
      user.avatar = {
        data: avatarBase64,
        contentType: req.file.mimetype,
      };
      await user.save();

      res.status(200).json({
        message: "Avatar uploaded successfully",
        avatar: { data: avatarBase64, contentType: req.file.mimetype },
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

export default router;
