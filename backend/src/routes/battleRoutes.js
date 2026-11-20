import express from 'express';
import {
  createBattle,
  joinBattle,
  getBattleById,
  updateBattleStatus,
  getBattlesByUser,
  getBattles,
} from '../controllers/battleController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(optionalAuth, createBattle)
  .get(getBattles);

router.post('/:id/join', optionalAuth, joinBattle);
router.patch('/:id/status', optionalAuth, updateBattleStatus);
router.get('/user/:userId', getBattlesByUser);
router.get('/:id', getBattleById);

export default router;
