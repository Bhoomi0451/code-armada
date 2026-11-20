import mongoose from 'mongoose';
import User from '../models/User.js';

/**
 * Service to calculate and retrieve leaderboards using high-performance MongoDB aggregation pipelines.
 */
class LeaderboardService {
  /**
   * Fetch global leaderboard with pagination and optional college filter.
   * Ranking Rule:
   *  1. totalPerformanceScore (totalCodingScore + totalInterviewScore) DESC
   *  2. winRate (wins / totalBattles * 100) DESC
   *  3. wins DESC
   *  4. totalBattles DESC
   */
  async getLeaderboard({ page = 1, limit = 20, college = null } = {}) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skipNum = (pageNum - 1) * limitNum;

    const matchStage = {};
    if (college) {
      matchStage.college = new RegExp(`^${college}$`, 'i');
    }

    const pipeline = [
      { $match: matchStage },
      {
        $project: {
          username: 1,
          fullName: 1,
          profileImage: 1,
          college: 1,
          skills: 1,
          totalBattles: { $ifNull: ['$codingStats.totalBattles', 0] },
          wins: { $ifNull: ['$codingStats.wins', 0] },
          losses: { $ifNull: ['$codingStats.losses', 0] },
          totalCodingScore: { $ifNull: ['$codingStats.totalCodingScore', 0] },
          totalInterviewScore: { $ifNull: ['$codingStats.totalInterviewScore', 0] },
          totalPerformanceScore: {
            $add: [
              { $ifNull: ['$codingStats.totalCodingScore', 0] },
              { $ifNull: ['$codingStats.totalInterviewScore', 0] },
            ],
          },
          winRate: {
            $cond: [
              { $gt: ['$codingStats.totalBattles', 0] },
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          { $ifNull: ['$codingStats.wins', 0] },
                          '$codingStats.totalBattles',
                        ],
                      },
                      100,
                    ],
                  },
                  1,
                ],
              },
              0,
            ],
          },
          averageCodingScore: {
            $cond: [
              { $gt: ['$codingStats.totalBattles', 0] },
              {
                $round: [
                  {
                    $divide: [
                      { $ifNull: ['$codingStats.totalCodingScore', 0] },
                      '$codingStats.totalBattles',
                    ],
                  },
                  1,
                ],
              },
              0,
            ],
          },
          averageInterviewScore: {
            $cond: [
              { $gt: ['$codingStats.totalBattles', 0] },
              {
                $round: [
                  {
                    $divide: [
                      { $ifNull: ['$codingStats.totalInterviewScore', 0] },
                      '$codingStats.totalBattles',
                    ],
                  },
                  1,
                ],
              },
              0,
            ],
          },
        },
      },
      {
        $sort: {
          totalPerformanceScore: -1,
          winRate: -1,
          wins: -1,
          totalBattles: -1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'totalUsers' }],
          entries: [{ $skip: skipNum }, { $limit: limitNum }],
        },
      },
    ];

    const [result] = await User.aggregate(pipeline);
    const totalUsers = result.metadata[0]?.totalUsers || 0;
    const entries = result.entries.map((entry, index) => ({
      rank: skipNum + index + 1,
      ...entry,
    }));

    return {
      totalUsers,
      currentPage: pageNum,
      totalPages: Math.ceil(totalUsers / limitNum) || 1,
      limit: limitNum,
      entries,
    };
  }

  /**
   * Get an individual user's exact ranking on the global leaderboard.
   */
  async getUserRank(userId) {
    const objectId = new mongoose.Types.ObjectId(userId);
    const user = await User.findById(objectId);
    if (!user) return null;

    const userTotalScore =
      (user.codingStats?.totalCodingScore || 0) +
      (user.codingStats?.totalInterviewScore || 0);
    const userTotalBattles = user.codingStats?.totalBattles || 0;
    const userWins = user.codingStats?.wins || 0;
    const userWinRate =
      userTotalBattles > 0 ? (userWins / userTotalBattles) * 100 : 0;

    // Count how many users rank higher than this user
    const higherRankedUsersCount = await User.countDocuments({
      $or: [
        {
          $expr: {
            $gt: [
              {
                $add: [
                  '$codingStats.totalCodingScore',
                  '$codingStats.totalInterviewScore',
                ],
              },
              userTotalScore,
            ],
          },
        },
        {
          $expr: {
            $and: [
              {
                $eq: [
                  {
                    $add: [
                      '$codingStats.totalCodingScore',
                      '$codingStats.totalInterviewScore',
                    ],
                  },
                  userTotalScore,
                ],
              },
              { $gt: ['$codingStats.wins', userWins] },
            ],
          },
        },
      ],
    });

    const rank = higherRankedUsersCount + 1;
    const totalUsers = await User.countDocuments();
    const percentile =
      totalUsers > 0 ? Math.round(((totalUsers - rank) / totalUsers) * 100) : 100;

    return {
      userId: user._id,
      username: user.username,
      rank,
      totalUsers,
      percentile,
      totalPerformanceScore: userTotalScore,
      winRate: Math.round(userWinRate * 10) / 10,
    };
  }
}

export default new LeaderboardService();
