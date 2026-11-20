import Problem from '../models/Problem.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Create a new problem (Admin/System)
 * @route   POST /api/problems
 * @access  Protected
 */
export const createProblem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    difficulty,
    topics,
    constraints,
    inputFormat,
    outputFormat,
    examples,
    starterCode,
    supportedLanguages,
    testCases,
  } = req.body;

  if (!title || !description || !difficulty || !topics || !inputFormat || !outputFormat || !testCases) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required problem fields: title, description, difficulty, topics, inputFormat, outputFormat, and testCases.',
    });
  }

  // Ensure at least one testcase is marked as sample
  const hasSample = testCases.some((tc) => tc.isSample === true);
  if (!hasSample) {
    testCases[0].isSample = true;
  }

  const problem = await Problem.create({
    title,
    description,
    difficulty,
    topics: Array.isArray(topics) ? topics : [topics],
    constraints: Array.isArray(constraints) ? constraints : [constraints],
    inputFormat,
    outputFormat,
    examples: Array.isArray(examples) ? examples : [],
    starterCode: Array.isArray(starterCode) ? starterCode : [],
    supportedLanguages: Array.isArray(supportedLanguages)
      ? supportedLanguages
      : ['javascript', 'python', 'cpp', 'java'],
    testCases,
    createdBy: req.user ? req.user._id : null,
  });

  res.status(201).json({
    success: true,
    message: 'Problem created successfully.',
    data: problem.toPublicJSON(),
  });
});

/**
 * @desc    Get all active problems with filtering (Hidden test cases filtered out)
 * @route   GET /api/problems
 * @access  Public
 */
export const getProblems = asyncHandler(async (req, res) => {
  const { difficulty, topic, search, page = 1, limit = 20 } = req.query;

  const query = { isActive: true };

  if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
    query.difficulty = difficulty;
  }

  if (topic) {
    query.topics = { $in: [new RegExp(`^${topic}$`, 'i')] };
  }

  if (search) {
    query.$text = { $search: search };
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [problems, total] = await Promise.all([
    Problem.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Problem.countDocuments(query),
  ]);

  // Redact hidden test cases from all public problems
  const publicProblems = problems.map((p) => p.toPublicJSON());

  res.status(200).json({
    success: true,
    data: {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      problems: publicProblems,
    },
  });
});

/**
 * @desc    Get problem by ID (Public: only sample test cases returned)
 * @route   GET /api/problems/:id
 * @access  Public
 */
export const getProblemById = asyncHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.id);
  if (!problem || !problem.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Problem not found or inactive.',
    });
  }

  // Never expose hidden test cases on public fetch
  res.status(200).json({
    success: true,
    data: problem.toPublicJSON(),
  });
});

/**
 * @desc    Get complete problem with all test cases (Internal / Authorized execution service)
 * @route   GET /api/problems/:id/full
 * @access  Protected
 */
export const getProblemFull = asyncHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.id);
  if (!problem) {
    return res.status(404).json({
      success: false,
      message: 'Problem not found.',
    });
  }

  res.status(200).json({
    success: true,
    data: problem,
  });
});

/**
 * @desc    Update problem details
 * @route   PUT /api/problems/:id
 * @access  Protected
 */
export const updateProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.id);
  if (!problem) {
    return res.status(404).json({
      success: false,
      message: 'Problem not found.',
    });
  }

  const allowedUpdates = [
    'title',
    'description',
    'difficulty',
    'topics',
    'constraints',
    'inputFormat',
    'outputFormat',
    'examples',
    'starterCode',
    'supportedLanguages',
    'testCases',
    'isActive',
  ];

  allowedUpdates.forEach((key) => {
    if (req.body[key] !== undefined) {
      problem[key] = req.body[key];
    }
  });

  const updatedProblem = await problem.save();

  res.status(200).json({
    success: true,
    message: 'Problem updated successfully.',
    data: updatedProblem.toPublicJSON(),
  });
});

/**
 * @desc    Deactivate or soft delete problem
 * @route   DELETE /api/problems/:id
 * @access  Protected
 */
export const deleteProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.id);
  if (!problem) {
    return res.status(404).json({
      success: false,
      message: 'Problem not found.',
    });
  }

  // Soft delete: set isActive to false
  problem.isActive = false;
  await problem.save();

  res.status(200).json({
    success: true,
    message: 'Problem deactivated successfully.',
  });
});

export default {
  createProblem,
  getProblems,
  getProblemById,
  getProblemFull,
  updateProblem,
  deleteProblem,
};
