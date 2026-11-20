import mongoose from 'mongoose';
import User from '../models/User.js';
import Result from '../models/Result.js';
import Battle from '../models/Battle.js';
import Submission from '../models/Submission.js';

/**
 * Service managing user performance statistics and battle synchronization
 */
class StatisticsService {
  /**
   * Atomically updates a user's codingStats following a battle completion.
   * Ensures idempotency: requires resultId check to prevent multiple updates for the same match.
   */
  async recordBattlePerformance(userId, { won, codingScore = 0, interviewScore = 0 }) {
    const numericCodingScore = Math.max(0, Number(codingScore) || 0);
    const numericInterviewScore = Math.max(0, Number(interviewScore) || 0);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          'codingStats.totalBattles': 1,
          'codingStats.wins': won ? 1 : 0,
          'codingStats.losses': won ? 0 : 1,
          'codingStats.totalCodingScore': numericCodingScore,
          'codingStats.totalInterviewScore': numericInterviewScore,
        },
      },
      { new: true, runValidators: true }
    );

    return updatedUser;
  }

  /**
   * Fetch comprehensive user statistics including aggregates and historical trends.
   */
  async getUserDetailedStats(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const user = await User.findById(userObjectId).select('-password');
    if (!user) return null;

    const stats = user.codingStats || {
      totalBattles: 0,
      wins: 0,
      losses: 0,
      totalCodingScore: 0,
      totalInterviewScore: 0,
    };

    const winRate =
      stats.totalBattles > 0
        ? Math.round((stats.wins / stats.totalBattles) * 1000) / 10
        : 0;

    const avgCodingScore =
      stats.totalBattles > 0
        ? Math.round((stats.totalCodingScore / stats.totalBattles) * 10) / 10
        : 0;

    const avgInterviewScore =
      stats.totalBattles > 0
        ? Math.round((stats.totalInterviewScore / stats.totalBattles) * 10) / 10
        : 0;

    // Get best performance (highest totalScore submission)
    const bestResult = await Result.findOne({ user: userObjectId })
      .sort({ totalScore: -1, codingScore: -1 })
      .populate('battle', 'battleId')
      .populate('submission', 'language executionTime passedTestCases totalTestCases');

    // Get 5 most recent battle results
    const recentResults = await Result.find({ user: userObjectId })
      .sort({ completedAt: -1 })
      .limit(5)
      .populate({
        path: 'battle',
        select: 'battleId problem winner status createdAt',
        populate: [
          { path: 'problem', select: 'title difficulty topics' },
          { path: 'winner', select: 'username fullName' },
        ],
      });

    // Aggregate unique strengths and improvement suggestions from results
    const aggregateReports = await Result.aggregate([
      { $match: { user: userObjectId } },
      { $unwind: { path: '$strengths', preserveNullAndEmptyArrays: false } },
      { $group: { _id: '$strengths', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const aggregateWeaknesses = await Result.aggregate([
      { $match: { user: userObjectId } },
      { $unwind: { path: '$weaknesses', preserveNullAndEmptyArrays: false } },
      { $group: { _id: '$weaknesses', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    return {
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        college: user.college,
        profileImage: user.profileImage,
        skills: user.skills,
        createdAt: user.createdAt,
      },
      summary: {
        totalBattles: stats.totalBattles,
        wins: stats.wins,
        losses: stats.losses,
        winRate: `${winRate}%`,
        totalCodingScore: stats.totalCodingScore,
        totalInterviewScore: stats.totalInterviewScore,
        totalPerformanceScore: stats.totalCodingScore + stats.totalInterviewScore,
        averageCodingScore: avgCodingScore,
        averageInterviewScore: avgInterviewScore,
      },
      bestPerformance: bestResult
        ? {
            battleId: bestResult.battle?.battleId,
            codingScore: bestResult.codingScore,
            interviewScore: bestResult.interviewScore,
            totalScore: bestResult.totalScore,
            rank: bestResult.rank,
            completedAt: bestResult.completedAt,
          }
        : null,
      topStrengths: aggregateReports.map((s) => s._id),
      topAreasForImprovement: aggregateWeaknesses.map((w) => w._id),
      recentBattles: recentResults,
    };
  }
}

export default new StatisticsService();
