import Result from '../models/Result.js';
import Battle from '../models/Battle.js';
import Submission from '../models/Submission.js';
import Interview from '../models/Interview.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import leaderboardService from '../services/leaderboardService.js';
import statisticsService from '../services/statisticsService.js';

/**
 * @desc    Generate / store final battle result for a participant
 * @route   POST /api/results
 * @access  Protected / Internal
 */
export const createResult = asyncHandler(async (req, res) => {
  const {
    battleId,
    submissionId,
    interviewId,
    codingScore,
    interviewScore,
    accuracy,
    executionTime = 0,
    strengths = [],
    weaknesses = [],
    improvementSuggestions = [],
    aiPerformanceReport = {},
  } = req.body;

  const userId = req.user ? req.user._id : req.body.userId;

  if (!userId || !battleId || !submissionId) {
    return res.status(400).json({
      success: false,
      message: 'Please provide userId, battleId, and submissionId.',
    });
  }

  // Resolve battle
  const battle = await Battle.findOne(
    battleId.toString().startsWith('BTL-') ? { battleId } : { _id: battleId }
  );
  if (!battle) {
    return res.status(404).json({
      success: false,
      message: 'Battle not found.',
    });
  }

  // Check if result already exists for this user and battle (Duplicate Prevention)
  const existingResult = await Result.findOne({
    battle: battle._id,
    user: userId,
  });

  if (existingResult) {
    return res.status(409).json({
      success: false,
      message: 'Final result has already been recorded for this participant and battle.',
      data: existingResult,
    });
  }

  // Verify submission
  const submission = await Submission.findById(submissionId);
  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Submission not found.',
    });
  }

  // Resolve interview if provided or look it up automatically
  let resolvedInterviewId = interviewId;
  if (!resolvedInterviewId) {
    const interview = await Interview.findOne({
      battle: battle._id,
      user: userId,
    });
    if (interview) {
      resolvedInterviewId = interview._id;
    }
  }

  const finalCodingScore =
    codingScore !== undefined ? Number(codingScore) : submission.codingScore || 0;
  const finalInterviewScore =
    interviewScore !== undefined ? Number(interviewScore) : 0;
  const finalAccuracy =
    accuracy !== undefined
      ? Number(accuracy)
      : submission.totalTestCases > 0
      ? Math.round((submission.passedTestCases / submission.totalTestCases) * 100)
      : 0;

  const result = await Result.create({
    battle: battle._id,
    user: userId,
    submission: submission._id,
    interview: resolvedInterviewId || null,
    codingScore: finalCodingScore,
    interviewScore: finalInterviewScore,
    accuracy: finalAccuracy,
    executionTime: executionTime || submission.executionTime || 0,
    strengths: Array.isArray(strengths) ? strengths : [],
    weaknesses: Array.isArray(weaknesses) ? weaknesses : [],
    improvementSuggestions: Array.isArray(improvementSuggestions)
      ? improvementSuggestions
      : [],
    aiPerformanceReport,
  });

  // Check if the other participant's result already exists in this battle
  const allBattleResults = await Result.find({ battle: battle._id });

  if (allBattleResults.length === 2) {
    // Both participants have submitted results -> Determine winner & ranks
    const [resA, resB] = allBattleResults;

    let winnerId = null;
    if (resA.totalScore > resB.totalScore) {
      resA.rank = 1;
      resB.rank = 2;
      winnerId = resA.user;
    } else if (resB.totalScore > resA.totalScore) {
      resB.rank = 1;
      resA.rank = 2;
      winnerId = resB.user;
    } else {
      // Tie breaker: faster execution time wins
      if (resA.executionTime <= resB.executionTime) {
        resA.rank = 1;
        resB.rank = 2;
        winnerId = resA.user;
      } else {
        resB.rank = 1;
        resA.rank = 2;
        winnerId = resB.user;
      }
    }

    await Promise.all([resA.save(), resB.save()]);

    // Update Battle to Completed
    battle.status = 'Completed';
    battle.winner = winnerId;
    battle.endTime = new Date();
    battle.participantScores = [
      {
        user: resA.user,
        codingScore: resA.codingScore,
        interviewScore: resA.interviewScore,
        totalScore: resA.totalScore,
      },
      {
        user: resB.user,
        codingScore: resB.codingScore,
        interviewScore: resB.interviewScore,
        totalScore: resB.totalScore,
      },
    ];
    await battle.save();

    // Synchronize both participants' stats atomically and idempotently
    await Promise.all([
      statisticsService.recordBattlePerformance(resA.user, {
        won: resA.rank === 1,
        codingScore: resA.codingScore,
        interviewScore: resA.interviewScore,
      }),
      statisticsService.recordBattlePerformance(resB.user, {
        won: resB.rank === 1,
        codingScore: resB.codingScore,
        interviewScore: resB.interviewScore,
      }),
    ]);
  } else {
    // Only one participant completed so far, update user's stats tentatively or await 2nd
    await statisticsService.recordBattlePerformance(userId, {
      won: false, // will be confirmed when match closes
      codingScore: finalCodingScore,
      interviewScore: finalInterviewScore,
    });
  }

  const populatedResult = await Result.findById(result._id)
    .populate('user', 'username fullName profileImage college')
    .populate('battle', 'battleId status winner')
    .populate('submission', 'language passedTestCases totalTestCases');

  res.status(201).json({
    success: true,
    message: 'Battle result recorded successfully.',
    data: populatedResult,
  });
});

/**
 * @desc    Get results for a specific battle (both participants)
 * @route   GET /api/results/battle/:battleId
 * @access  Public
 */
export const getResultsByBattle = asyncHandler(async (req, res) => {
  const battle = await Battle.findOne(
    req.params.battleId.startsWith('BTL-')
      ? { battleId: req.params.battleId }
      : { _id: req.params.battleId }
  );

  if (!battle) {
    return res.status(404).json({
      success: false,
      message: 'Battle not found.',
    });
  }

  const results = await Result.find({ battle: battle._id })
    .sort({ rank: 1, totalScore: -1 })
    .populate('user', 'username fullName profileImage college')
    .populate('submission', 'language passedTestCases totalTestCases codingScore executionTime')
    .populate('interview', 'questions participantResponses totalInterviewScore evaluationStatus');

  res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
});

/**
 * @desc    Get performance history and results for a user
 * @route   GET /api/results/user/:userId
 * @access  Public
 */
export const getResultsByUser = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [results, total] = await Promise.all([
    Result.find({ user: req.params.userId })
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate({
        path: 'battle',
        select: 'battleId problem winner status createdAt',
        populate: [
          { path: 'problem', select: 'title difficulty topics' },
          { path: 'winner', select: 'username fullName' },
        ],
      })
      .populate('submission', 'language passedTestCases totalTestCases codingScore'),
    Result.countDocuments({ user: req.params.userId }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      results,
    },
  });
});

/**
 * @desc    Get global leaderboard
 * @route   GET /api/results/leaderboard
 * @access  Public
 */
export const getLeaderboard = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, college } = req.query;

  const data = await leaderboardService.getLeaderboard({
    page,
    limit,
    college,
  });

  res.status(200).json({
    success: true,
    data,
  });
});

export default {
  createResult,
  getResultsByBattle,
  getResultsByUser,
  getLeaderboard,
};
