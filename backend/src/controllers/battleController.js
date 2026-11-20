import Battle from '../models/Battle.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// Helper to generate unique human-readable battle ID
const generateBattleId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BTL-${code}`;
};

/**
 * @desc    Create a new battle room
 * @route   POST /api/battles
 * @access  Protected
 */
export const createBattle = asyncHandler(async (req, res) => {
  const { problemId, duration = 1800 } = req.body;
  const userId = req.user ? req.user._id : req.body.userId;

  if (!problemId) {
    return res.status(400).json({
      success: false,
      message: 'problemId is required to create a battle.',
    });
  }

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'Participant userId is required to create a battle.',
    });
  }

  // Verify problem exists and is active
  const problem = await Problem.findById(problemId);
  if (!problem || !problem.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Specified problem was not found or is inactive.',
    });
  }

  // Verify user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Host user not found.',
    });
  }

  // Generate unique battleId
  let battleId = generateBattleId();
  let exists = await Battle.findOne({ battleId });
  while (exists) {
    battleId = generateBattleId();
    exists = await Battle.findOne({ battleId });
  }

  const battle = await Battle.create({
    battleId,
    problem: problem._id,
    duration: Number(duration) || 1800,
    status: 'Waiting',
    participants: [{ user: user._id, isReady: true, joinedAt: new Date() }],
  });

  const populatedBattle = await Battle.findById(battle._id)
    .populate('participants.user', 'username fullName profileImage college')
    .populate({
      path: 'problem',
      select: '-testCases.expectedOutput', // Protect test case output
    });

  res.status(201).json({
    success: true,
    message: 'Battle created successfully in Waiting state.',
    data: populatedBattle,
  });
});

/**
 * @desc    Join an existing battle (Add 2nd participant)
 * @route   POST /api/battles/:id/join
 * @access  Protected
 */
export const joinBattle = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : req.body.userId;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'Participant userId is required.',
    });
  }

  // Find battle by _id or by battleId
  const query = req.params.id.startsWith('BTL-')
    ? { battleId: req.params.id }
    : { _id: req.params.id };

  const battle = await Battle.findOne(query);
  if (!battle) {
    return res.status(404).json({
      success: false,
      message: 'Battle not found.',
    });
  }

  if (battle.status !== 'Waiting') {
    return res.status(400).json({
      success: false,
      message: `Cannot join battle with status '${battle.status}'. Only 'Waiting' battles accept participants.`,
    });
  }

  // Check if user is already a participant
  const isAlreadyJoined = battle.participants.some(
    (p) => p.user.toString() === userId.toString()
  );

  if (isAlreadyJoined) {
    return res.status(400).json({
      success: false,
      message: 'User has already joined this battle.',
    });
  }

  if (battle.participants.length >= 2) {
    return res.status(400).json({
      success: false,
      message: 'Battle is already full (maximum 2 participants for 1v1).',
    });
  }

  // Add 2nd participant and automatically activate battle!
  battle.participants.push({
    user: userId,
    isReady: true,
    joinedAt: new Date(),
  });

  battle.status = 'Active';
  battle.startTime = new Date();

  await battle.save();

  const populatedBattle = await Battle.findById(battle._id)
    .populate('participants.user', 'username fullName profileImage college')
    .populate('problem', 'title difficulty topics description');

  res.status(200).json({
    success: true,
    message: 'Participant joined. Battle is now Active.',
    data: populatedBattle,
  });
});

/**
 * @desc    Get battle details by ID or battleId
 * @route   GET /api/battles/:id
 * @access  Public
 */
export const getBattleById = asyncHandler(async (req, res) => {
  const query = req.params.id.startsWith('BTL-')
    ? { battleId: req.params.id }
    : { _id: req.params.id };

  const battle = await Battle.findOne(query)
    .populate('participants.user', 'username fullName profileImage college codingStats')
    .populate('problem', 'title difficulty topics description constraints inputFormat outputFormat examples starterCode')
    .populate('winner', 'username fullName profileImage');

  if (!battle) {
    return res.status(404).json({
      success: false,
      message: 'Battle not found.',
    });
  }

  res.status(200).json({
    success: true,
    data: battle,
  });
});

/**
 * @desc    Update battle status (e.g. Active, Completed, Cancelled)
 * @route   PATCH /api/battles/:id/status
 * @access  Protected
 */
export const updateBattleStatus = asyncHandler(async (req, res) => {
  const { status, winnerId, participantScores } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Status is required.',
    });
  }

  const query = req.params.id.startsWith('BTL-')
    ? { battleId: req.params.id }
    : { _id: req.params.id };

  const battle = await Battle.findOne(query);
  if (!battle) {
    return res.status(404).json({
      success: false,
      message: 'Battle not found.',
    });
  }

  // Enforce valid status transitions
  const validTransitions = {
    Waiting: ['Active', 'Cancelled'],
    Active: ['Completed', 'Cancelled'],
    Completed: [],
    Cancelled: [],
  };

  const allowed = validTransitions[battle.status] || [];
  if (!allowed.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status transition from '${battle.status}' to '${status}'.`,
    });
  }

  // If transitioning to Active, verify exactly 2 participants
  if (status === 'Active' && battle.participants.length !== 2) {
    return res.status(400).json({
      success: false,
      message: 'A battle must have exactly two participants before becoming Active.',
    });
  }

  battle.status = status;

  if (winnerId) {
    battle.winner = winnerId;
  }

  if (Array.isArray(participantScores)) {
    battle.participantScores = participantScores;
  }

  await battle.save();

  const populatedBattle = await Battle.findById(battle._id)
    .populate('participants.user', 'username fullName profileImage')
    .populate('problem', 'title difficulty topics')
    .populate('winner', 'username fullName');

  res.status(200).json({
    success: true,
    message: `Battle status transitioned to '${status}'.`,
    data: populatedBattle,
  });
});

/**
 * @desc    Get all battles for a specific user
 * @route   GET /api/battles/user/:userId
 * @access  Public
 */
export const getBattlesByUser = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const query = { 'participants.user': req.params.userId };
  if (status) {
    query.status = status;
  }

  const [battles, total] = await Promise.all([
    Battle.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('participants.user', 'username fullName profileImage')
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

/**
 * @desc    Get active/waiting battles or all battles with status filter
 * @route   GET /api/battles
 * @access  Public
 */
export const getBattles = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const query = {};
  if (status) {
    query.status = status;
  }

  const [battles, total] = await Promise.all([
    Battle.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('participants.user', 'username fullName profileImage')
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
  createBattle,
  joinBattle,
  getBattleById,
  updateBattleStatus,
  getBattlesByUser,
  getBattles,
};
