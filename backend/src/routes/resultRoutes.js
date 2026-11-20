import express from 'express';
import {
  createResult,
  getResultsByBattle,
  getResultsByUser,
  getLeaderboard,
} from '../controllers/resultController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.post('/', optionalAuth, createResult);
router.get('/battle/:battleId', getResultsByBattle);
router.get('/user/:userId', getResultsByUser);

export default router;
