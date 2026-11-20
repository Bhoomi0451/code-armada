import express from 'express';
import {
  createInterview,
  getInterviewById,
  getInterviewByBattleAndUser,
  saveParticipantResponses,
  updateEvaluation,
} from '../controllers/interviewController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, createInterview);
router.get('/:id', getInterviewById);
router.get('/battle/:battleId/user/:userId', getInterviewByBattleAndUser);
router.post('/:id/responses', optionalAuth, saveParticipantResponses);
router.patch('/:id/evaluate', optionalAuth, updateEvaluation);

export default router;
