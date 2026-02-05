import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// STEP 5: Verify Token on Backend (Middleware)
const verifyToken = (req, res, next) => {
  // Extract token from cookies
  const token = req.cookies.nayacode_token;

  // Check if token exists
  if (!token) {
    return res.status(401).json({ 
      message: 'Unauthorized - No token provided' 
    });
  }

  // Verify the JWT token
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        message: 'Invalid or expired token' 
      });
    }
    
    // Find user and attach to request
    try {
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }
      
      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  });
};

export default verifyToken;