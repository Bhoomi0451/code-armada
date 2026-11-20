import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Battle from '../models/Battle.js';
import asyncHandler from '../utils/asyncHandler.js';
import statisticsService from '../services/statisticsService.js';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'code_armada_super_secure_jwt_secret_key_2026',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password, college, skills, profileImage } = req.body;

  if (!username || !fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide username, fullName, email, and password.',
    });
  }

  // Check if email already registered
  const existingEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists.',
    });
  }

  // Check if username taken
  const existingUsername = await User.findOne({ username: username.toLowerCase() });
  if (existingUsername) {
    return res.status(409).json({
      success: false,
      message: 'Username is already taken.',
    });
  }

  const user = await User.create({
    username,
    fullName,
    email,
    password,
    college: college || '',
    skills: Array.isArray(skills) ? skills : [],
    ...(profileImage && { profileImage }),
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully.',
    data: {
      user: user.toJSON(),
      token,
    },
  });
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password.',
    });
  }

  // Explicitly select password since it has select: false
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: {
      user: user.toJSON(),
      token,
    },
  });
});

/**
 * @desc    Get user profile by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found.',
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/:id
 * @access  Protected
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, college, skills, profileImage } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found.',
    });
  }

  if (fullName !== undefined) user.fullName = fullName;
  if (college !== undefined) user.college = college;
  if (skills !== undefined) user.skills = Array.isArray(skills) ? skills : user.skills;
  if (profileImage !== undefined) user.profileImage = profileImage;

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: updatedUser,
  });
});

/**
 * @desc    Get user coding statistics
 * @route   GET /api/users/:id/stats
 * @access  Public
 */
export const getUserStats = asyncHandler(async (req, res) => {
  const stats = await statisticsService.getUserDetailedStats(req.params.id);
  if (!stats) {
    return res.status(404).json({
      success: false,
      message: 'User not found.',
    });
  }

  res.status(200).json({
    success: true,
    data: stats,
  });
});

/**
 * @desc    Get user's battle history
 * @route   GET /api/users/:id/battles
 * @access  Public
 */
export const getUserBattleHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const query = { 'participants.user': req.params.id };

  const [battles, total] = await Promise.all([
    Battle.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('participants.user', 'username fullName profileImage college')
      .populate('problem', 'title difficulty topics')
      .populate('winner', 'username fullName'),
    Battle.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      battles,
    },
  });
});

export default {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserStats,
  getUserBattleHistory,
};
