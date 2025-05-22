// middleware/auth.js
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add the decoded user (userId) to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

/**
 * Middleware to check if user is authenticated without adding user to request
 * Useful for routes that only need to verify login status
 */
const isLoggedIn = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

/**
 * Middleware to check if user has a specific role
 * @param {string|string[]} roles - Role or array of roles allowed to access the route
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    // First authenticate the user
    authMiddleware(req, res, () => {
      // Check if roles is an array, if not convert to array
      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      
      // Once authenticated, check if user has the required role
      if (req.user && allowedRoles.includes(req.user.role)) {
        next();
      } else {
        res.status(403).json({ message: 'Access denied: Insufficient permissions' });
      }
    });
  };
};

/**
 * Middleware to handle API key authentication
 * Used for service-to-service communication or public API access
 */
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: 'Invalid API key' });
  }
  
  next();
};

/**
 * Middleware to verify refresh token and issue new access token
 */
const refreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Generate new access token
    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Send new access token
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Set default avatar for new users
const getDefaultAvatar = async () => {
  try {
    const avatarPath = path.join(process.cwd(), 'avatars', 'default_avatar.png');
    const imageBuffer = await fs.readFile(avatarPath);
    return {
      data: imageBuffer.toString('base64'),
      contentType: 'image/png'
    };
  } catch (error) {
    console.error('Error loading default avatar:', error);
    return null;
  }
};

export { authMiddleware, isLoggedIn, requireRole, apiKeyAuth, refreshToken, getDefaultAvatar };
export default authMiddleware;