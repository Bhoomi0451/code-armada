import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserStats,
  getUserBattleHistory,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUserProfile);
router.put('/:id', protect, updateUserProfile);
router.get('/:id/stats', getUserStats);
router.get('/:id/battles', getUserBattleHistory);

export default router;
