import Interview from '../models/Interview.js';
import Battle from '../models/Battle.js';
import Submission from '../models/Submission.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Create / Initialize an interview with AI-generated questions
 * @route   POST /api/interviews
 * @access  Protected / Internal
 */
export const createInterview = asyncHandler(async (req, res) => {
  const { battleId, submissionId, questions } = req.body;
  const userId = req.user ? req.user._id : req.body.userId;

  if (!userId || !battleId || !submissionId || !questions || !Array.isArray(questions)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide userId, battleId, submissionId, and an array of questions.',
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

  // Resolve submission
  const submission = await Submission.findById(submissionId);
  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Submission not found.',
    });
  }

  // Check if an interview already exists for this participant and battle
  let interview = await Interview.findOne({ user: userId, battle: battle._id });
  if (interview) {
    // If questions are provided, update them
    interview.questions = questions;
    interview.submission = submission._id;
    interview.evaluationStatus = 'Pending';
    await interview.save();

    return res.status(200).json({
      success: true,
      message: 'Interview updated with new questions.',
      data: interview,
    });
  }

  interview = await Interview.create({
    user: userId,
    battle: battle._id,
    submission: submission._id,
    questions,
    evaluationStatus: 'Pending',
    totalInterviewScore: 0,
  });

  res.status(201).json({
    success: true,
    message: 'Interview created successfully with AI questions.',
    data: interview,
  });
});

/**
 * @desc    Get interview details by ID
 * @route   GET /api/interviews/:id
 * @access  Public
 */
export const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id)
    .populate('user', 'username fullName profileImage college')
    .populate('submission', 'language sourceCode passedTestCases totalTestCases codingScore')
    .populate('battle', 'battleId status');

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found.',
    });
  }

  res.status(200).json({
    success: true,
    data: interview,
  });
});

/**
 * @desc    Get interview by battle and user
 * @route   GET /api/interviews/battle/:battleId/user/:userId
 * @access  Public
 */
export const getInterviewByBattleAndUser = asyncHandler(async (req, res) => {
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

  const interview = await Interview.findOne({
    battle: battle._id,
    user: req.params.userId,
  })
    .populate('user', 'username fullName profileImage')
    .populate('submission', 'language sourceCode codingScore')
    .populate('battle', 'battleId status');

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found for this user and battle.',
    });
  }

  res.status(200).json({
    success: true,
    data: interview,
  });
});

/**
 * @desc    Save participant responses to interview questions
 * @route   POST /api/interviews/:id/responses
 * @access  Protected / Participant
 */
export const saveParticipantResponses = asyncHandler(async (req, res) => {
  const { responses } = req.body;

  if (!responses || !Array.isArray(responses) || responses.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'responses must be a non-empty array of answer objects.',
    });
  }

  const interview = await Interview.findById(req.params.id);
  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found.',
    });
  }

  // Update or append participant responses
  responses.forEach((resp) => {
    const existingIndex = interview.participantResponses.findIndex(
      (r) => r.questionIndex === resp.questionIndex
    );

    if (existingIndex > -1) {
      interview.participantResponses[existingIndex].answer = resp.answer;
      if (resp.questionText) {
        interview.participantResponses[existingIndex].questionText = resp.questionText;
      }
    } else {
      interview.participantResponses.push({
        questionIndex: resp.questionIndex,
        questionText: resp.questionText || '',
        answer: resp.answer,
        awardedMarks: 0,
        feedback: '',
      });
    }
  });

  interview.evaluationStatus = 'In Progress';
  await interview.save();

  res.status(200).json({
    success: true,
    message: 'Participant responses saved successfully.',
    data: interview,
  });
});

/**
 * @desc    Store AI evaluation feedback and score
 * @route   PATCH /api/interviews/:id/evaluate
 * @access  Protected / AI Agent
 */
export const updateEvaluation = asyncHandler(async (req, res) => {
  const { evaluations } = req.body;

  if (!evaluations || !Array.isArray(evaluations)) {
    return res.status(400).json({
      success: false,
      message: 'evaluations must be an array of evaluated responses.',
    });
  }

  const interview = await Interview.findById(req.params.id);
  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found.',
    });
  }

  // Update each response with awardedMarks, feedback, and evaluatedAt
  evaluations.forEach((evalItem) => {
    const target = interview.participantResponses.find(
      (r) => r.questionIndex === evalItem.questionIndex
    );
    if (target) {
      target.awardedMarks = Math.max(0, Number(evalItem.awardedMarks) || 0);
      target.feedback = evalItem.feedback || '';
      target.evaluatedAt = new Date();
    }
  });

  interview.calculateTotalScore();
  interview.evaluationStatus = 'Completed';
  await interview.save();

  res.status(200).json({
    success: true,
    message: 'Interview evaluation recorded successfully.',
    data: interview,
  });
});

export default {
  createInterview,
  getInterviewById,
  getInterviewByBattleAndUser,
  saveParticipantResponses,
  updateEvaluation,
};
