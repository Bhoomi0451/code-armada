import express from 'express';
import {
  createProblem,
  getProblems,
  getProblemById,
  getProblemFull,
  updateProblem,
  deleteProblem,
} from '../controllers/problemController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createProblem)
  .get(getProblems);

router.get('/:id/full', protect, getProblemFull);

router.route('/:id')
  .get(getProblemById)
  .put(protect, updateProblem)
  .delete(protect, deleteProblem);

export default router;
