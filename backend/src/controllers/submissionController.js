import Submission from '../models/Submission.js';
import Battle from '../models/Battle.js';
import Problem from '../models/Problem.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Create a new submission
 * @route   POST /api/submissions
 * @access  Protected / Public with identifiers
 */
export const createSubmission = asyncHandler(async (req, res) => {
  const {
    battleId,
    problemId,
    sourceCode,
    language,
    executionResults,
    status = 'Pending',
    executionTime = 0,
    memoryUsed = 0,
  } = req.body;

  const userId = req.user ? req.user._id : req.body.userId;

  if (!userId || !battleId || !problemId || !sourceCode || !language) {
    return res.status(400).json({
      success: false,
      message: 'Please provide userId, battleId, problemId, sourceCode, and language.',
    });
  }

  // Find battle by _id or battleId
  const battle = await Battle.findOne(
    battleId.toString().startsWith('BTL-') ? { battleId } : { _id: battleId }
  );
  if (!battle) {
    return res.status(404).json({
      success: false,
      message: 'Battle not found.',
    });
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    return res.status(404).json({
      success: false,
      message: 'Problem not found.',
    });
  }

  // Calculate scores if executionResults are provided
  let passedTestCases = 0;
  let totalTestCases = 0;
  let codingScore = 0;
  let submissionStatus = status;

  if (Array.isArray(executionResults) && executionResults.length > 0) {
    totalTestCases = executionResults.length;
    passedTestCases = executionResults.filter((r) => r.status === 'Passed').length;
    codingScore = totalTestCases > 0 ? Math.round((passedTestCases / totalTestCases) * 100) : 0;
    submissionStatus = passedTestCases === totalTestCases ? 'Accepted' : 'Wrong Answer';
  }

  const submission = new Submission({
    user: userId,
    battle: battle._id,
    problem: problem._id,
    sourceCode,
    language: language.toLowerCase(),
    status: submissionStatus,
    executionResults: Array.isArray(executionResults) ? executionResults : [],
    passedTestCases,
    totalTestCases,
    executionTime,
    memoryUsed,
    codingScore,
    isBestSubmission: false,
  });

  // Check if this submission is the best so far for this user in this battle
  const previousBest = await Submission.findOne({
    user: userId,
    battle: battle._id,
    isBestSubmission: true,
  });

  if (!previousBest || codingScore > previousBest.codingScore) {
    if (previousBest) {
      previousBest.isBestSubmission = false;
      await previousBest.save();
    }
    submission.isBestSubmission = true;
  }

  await submission.save();

  res.status(201).json({
    success: true,
    message: 'Submission created successfully.',
    data: submission.toPublicJSON(),
  });
});

/**
 * @desc    Get submission by ID
 * @route   GET /api/submissions/:id
 * @access  Public
 */
export const getSubmissionById = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id)
    .populate('user', 'username fullName profileImage')
    .populate('problem', 'title difficulty topics');

  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Submission not found.',
    });
  }

  res.status(200).json({
    success: true,
    data: submission.toPublicJSON(),
  });
});

/**
 * @desc    Get all submissions for a battle
 * @route   GET /api/submissions/battle/:battleId
 * @access  Public
 */
export const getSubmissionsByBattle = asyncHandler(async (req, res) => {
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

  const submissions = await Submission.find({ battle: battle._id })
    .sort({ submittedAt: -1 })
    .populate('user', 'username fullName profileImage');

  res.status(200).json({
    success: true,
    count: submissions.length,
    data: submissions.map((s) => s.toPublicJSON()),
  });
});

/**
 * @desc    Get all submissions by a user
 * @route   GET /api/submissions/user/:userId
 * @access  Public
 */
export const getSubmissionsByUser = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [submissions, total] = await Promise.all([
    Submission.find({ user: req.params.userId })
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('problem', 'title difficulty topics')
      .populate('battle', 'battleId status'),
    Submission.countDocuments({ user: req.params.userId }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      submissions: submissions.map((s) => s.toPublicJSON()),
    },
  });
});

/**
 * @desc    Get best submission for a user in a specific battle
 * @route   GET /api/submissions/battle/:battleId/best/:userId
 * @access  Public
 */
export const getBestSubmission = asyncHandler(async (req, res) => {
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

  const bestSubmission = await Submission.findOne({
    battle: battle._id,
    user: req.params.userId,
    isBestSubmission: true,
  }).populate('problem', 'title difficulty');

  if (!bestSubmission) {
    return res.status(404).json({
      success: false,
      message: 'No best submission found for this user and battle.',
    });
  }

  res.status(200).json({
    success: true,
    data: bestSubmission.toPublicJSON(),
  });
});

/**
 * @desc    Update execution results from code execution engine (Judge0)
 * @route   PATCH /api/submissions/:id/execution
 * @access  Protected / Internal
 */
export const updateExecutionResults = asyncHandler(async (req, res) => {
  const { executionResults, status, executionTime, memoryUsed } = req.body;

  const submission = await Submission.findById(req.params.id);
  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Submission not found.',
    });
  }

  if (Array.isArray(executionResults)) {
    submission.executionResults = executionResults;
    submission.totalTestCases = executionResults.length;
    submission.passedTestCases = executionResults.filter((r) => r.status === 'Passed').length;
    submission.codingScore =
      submission.totalTestCases > 0
        ? Math.round((submission.passedTestCases / submission.totalTestCases) * 100)
        : 0;
  }

  if (status) submission.status = status;
  if (executionTime !== undefined) submission.executionTime = executionTime;
  if (memoryUsed !== undefined) submission.memoryUsed = memoryUsed;

  // Check and update best submission status
  const currentBest = await Submission.findOne({
    battle: submission.battle,
    user: submission.user,
    isBestSubmission: true,
  });

  if (!currentBest || submission.codingScore > currentBest.codingScore) {
    if (currentBest && currentBest._id.toString() !== submission._id.toString()) {
      currentBest.isBestSubmission = false;
      await currentBest.save();
    }
    submission.isBestSubmission = true;
  }

  await submission.save();

  res.status(200).json({
    success: true,
    message: 'Execution results updated successfully.',
    data: submission.toPublicJSON(),
  });
});

export default {
  createSubmission,
  getSubmissionById,
  getSubmissionsByBattle,
  getSubmissionsByUser,
  getBestSubmission,
  updateExecutionResults,
};
