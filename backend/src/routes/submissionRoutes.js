import express from 'express';
import {
  createSubmission,
  getSubmissionById,
  getSubmissionsByBattle,
  getSubmissionsByUser,
  getBestSubmission,
  updateExecutionResults,
} from '../controllers/submissionController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, createSubmission);
router.get('/:id', getSubmissionById);
router.get('/battle/:battleId', getSubmissionsByBattle);
router.get('/user/:userId', getSubmissionsByUser);
router.get('/battle/:battleId/best/:userId', getBestSubmission);
router.patch('/:id/execution', protect, updateExecutionResults);

export default router;
