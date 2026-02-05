import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import User from './models/User.js';
import connectDB from './config/db.js';
import verifyToken from './middleware/auth.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET ;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], // Your frontend URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

// Handle preflight requests
app.options('*', cors());
app.use(express.json());
app.use(cookieParser());

// Generate JWT
const generateToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });

// ---------------- REGISTER ----------------
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const user = await new User({ username, email, password }).save();
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({ message: 'User registered', user: userObj });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = {};
      for (let field in error.errors) {
        messages[field] = error.errors[field].message;
      }
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ---------------- LOGIN ----------------
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.cookie('nayacode_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 1000 });

    const userObj = user.toObject();
    delete userObj.password;
    res.json({ message: 'Login successful', user: userObj, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ---------------- DASHBOARD ----------------
app.get('/api/dashboard', verifyToken, (req, res) => {
  res.json({ message: 'Welcome to Dashboard', user: req.user });
});

// ---------------- LOGOUT ----------------
app.post('/api/logout', (req, res) => {
  res.clearCookie('nayacode_token');
  res.json({ message: 'Logged out successfully' });
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
