import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Problem from '../models/Problem.js';
import Battle from '../models/Battle.js';
import Submission from '../models/Submission.js';
import Interview from '../models/Interview.js';
import Result from '../models/Result.js';
import RefreshToken from '../models/RefreshToken.js';

dotenv.config();

/**
 * Safely removes all demo documents across all Code Armada collections.
 */
const clearData = async () => {
  try {
    console.log('[Clear Script] Connecting to database...');
    await connectDB();

    console.log('[Clear Script] Purging all collections...');
    await Promise.all([
      User.deleteMany({}),
      Problem.deleteMany({}),
      Battle.deleteMany({}),
      Submission.deleteMany({}),
      Interview.deleteMany({}),
      Result.deleteMany({}),
      RefreshToken.deleteMany({}),
    ]);

    console.log('✅ All Code Armada demo collections cleared successfully.');
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error(`❌ Failed to clear database: ${error.message}`);
    process.exit(1);
  }
};

clearData();
