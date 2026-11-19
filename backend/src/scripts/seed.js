import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Problem from '../models/Problem.js';
import Battle from '../models/Battle.js';
import Submission from '../models/Submission.js';
import Interview from '../models/Interview.js';
import Result from '../models/Result.js';
import RefreshToken from '../models/RefreshToken.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('[Seed Script] Connecting to database...');
    await connectDB();

    console.log('[Seed Script] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Problem.deleteMany({}),
      Battle.deleteMany({}),
      Submission.deleteMany({}),
      Interview.deleteMany({}),
      Result.deleteMany({}),
      RefreshToken.deleteMany({}),
    ]);

    console.log('[Seed Script] Seeding users...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // 1. Users
    const users = await User.create([
      {
        username: 'alex_coder',
        fullName: 'Alex Chen',
        email: 'alex@codearena.dev',
        password: 'password123',
        college: 'Delhi Technological University (DTU)',
        skills: ['C++', 'Dynamic Programming', 'Graph Theory', 'Data Structures'],
        codingStats: {
          totalBattles: 3,
          wins: 3,
          losses: 0,
          totalCodingScore: 285,
          totalInterviewScore: 270,
        },
      },
      {
        username: 'sarah_dev',
        fullName: 'Sarah Miller',
        email: 'sarah@codearena.dev',
        password: 'password123',
        college: 'IIT Delhi',
        skills: ['Python', 'Algorithms', 'Sliding Window', 'Two Pointers'],
        codingStats: {
          totalBattles: 3,
          wins: 2,
          losses: 1,
          totalCodingScore: 260,
          totalInterviewScore: 250,
        },
      },
      {
        username: 'rohit_sharma',
        fullName: 'Rohit Verma',
        email: 'rohit@codearena.dev',
        password: 'password123',
        college: 'NIT Trichy',
        skills: ['Java', 'Binary Search Trees', 'Recursion', 'Backtracking'],
        codingStats: {
          totalBattles: 2,
          wins: 0,
          losses: 2,
          totalCodingScore: 150,
          totalInterviewScore: 160,
        },
      },
      {
        username: 'priya_tech',
        fullName: 'Priya Patel',
        email: 'priya@codearena.dev',
        password: 'password123',
        college: 'BITS Pilani',
        skills: ['JavaScript', 'Hash Tables', 'System Design', 'Arrays'],
        codingStats: {
          totalBattles: 1,
          wins: 0,
          losses: 1,
          totalCodingScore: 80,
          totalInterviewScore: 85,
        },
      },
      {
        username: 'vikram_cpp',
        fullName: 'Vikram Singh',
        email: 'vikram@codearena.dev',
        password: 'password123',
        college: 'IIIT Hyderabad',
        skills: ['C++', 'Competitive Programming', 'Segment Trees', 'Bit Manipulation'],
        codingStats: {
          totalBattles: 0,
          wins: 0,
          losses: 0,
          totalCodingScore: 0,
          totalInterviewScore: 0,
        },
      },
      {
        username: 'ananya_ai',
        fullName: 'Ananya Gupta',
        email: 'ananya@codearena.dev',
        password: 'password123',
        college: 'NSUT Delhi',
        skills: ['Python', 'Machine Learning', 'Greedy', 'Sorting'],
        codingStats: {
          totalBattles: 0,
          wins: 0,
          losses: 0,
          totalCodingScore: 0,
          totalInterviewScore: 0,
        },
      },
    ]);

    const [alex, sarah, rohit, priya, vikram, ananya] = users;

    console.log('[Seed Script] Seeding 10 DSA problems across Easy, Medium, and Hard...');

    // 2. 10 DSA Problems
    const problems = await Problem.create([
      {
        title: 'Two Sum',
        description:
          'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
        difficulty: 'Easy',
        topics: ['Arrays', 'Hash Table'],
        constraints: [
          '2 <= nums.length <= 10^4',
          '-10^9 <= nums[i] <= 10^9',
          '-10^9 <= target <= 10^9',
          'Only one valid answer exists.',
        ],
        inputFormat: 'Line 1: Comma-separated integers (nums)\nLine 2: Single integer (target)',
        outputFormat: 'Two space-separated indices: [i, j]',
        examples: [
          {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0,1]',
            explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
          },
          {
            input: 'nums = [3,2,4], target = 6',
            output: '[1,2]',
            explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
          },
        ],
        starterCode: [
          {
            language: 'javascript',
            code: 'function twoSum(nums, target) {\n  // Write your code here\n}',
          },
          {
            language: 'python',
            code: 'def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your code here\n    pass',
          },
          {
            language: 'cpp',
            code: '#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n}',
          },
        ],
        testCases: [
          { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isSample: true, marks: 10 },
          { input: '[3,2,4]\n6', expectedOutput: '[1,2]', isSample: true, marks: 10 },
          { input: '[3,3]\n6', expectedOutput: '[0,1]', isSample: false, marks: 20 },
          { input: '[-1,-2,-3,-4,-5]\n-8', expectedOutput: '[2,4]', isSample: false, marks: 30 },
          { input: '[0,4,3,0]\n0', expectedOutput: '[0,3]', isSample: false, marks: 30 },
        ],
        createdBy: alex._id,
      },
      {
        title: 'Valid Anagram',
        description:
          'Given two strings s and t, return true if t is an anagram of s, and false otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
        difficulty: 'Easy',
        topics: ['Strings', 'Hash Table', 'Sorting'],
        constraints: [
          '1 <= s.length, t.length <= 5 * 10^4',
          's and t consist of lowercase English letters.',
        ],
        inputFormat: 'Line 1: string s\nLine 2: string t',
        outputFormat: 'Boolean true or false',
        examples: [
          { input: 's = "anagram", t = "nagaram"', output: 'true', explanation: 'Same frequencies' },
          { input: 's = "rat", t = "car"', output: 'false', explanation: 'Different characters' },
        ],
        starterCode: [
          {
            language: 'javascript',
            code: 'function isAnagram(s, t) {\n  // Write your code here\n}',
          },
          {
            language: 'python',
            code: 'def isAnagram(s: str, t: str) -> bool:\n    pass',
          },
        ],
        testCases: [
          { input: 'anagram\nnagaram', expectedOutput: 'true', isSample: true, marks: 20 },
          { input: 'rat\ncar', expectedOutput: 'false', isSample: true, marks: 20 },
          { input: 'a\nab', expectedOutput: 'false', isSample: false, marks: 30 },
          { input: 'listen\nsilent', expectedOutput: 'true', isSample: false, marks: 30 },
        ],
        createdBy: sarah._id,
      },
      {
        title: 'Reverse String',
        description:
          'Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.',
        difficulty: 'Easy',
        topics: ['Two Pointers', 'Strings'],
        constraints: ['1 <= s.length <= 10^5', 's[i] is a printable ascii character.'],
        inputFormat: 'Array of characters',
        outputFormat: 'Reversed array of characters',
        examples: [
          { input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: 'Reversed' },
        ],
        testCases: [
          { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]', isSample: true, marks: 25 },
          { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]', isSample: false, marks: 75 },
        ],
      },
      {
        title: 'Palindrome Number',
        description:
          'Given an integer x, return true if x is a palindrome, and false otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward.',
        difficulty: 'Easy',
        topics: ['Math'],
        constraints: ['-2^31 <= x <= 2^31 - 1'],
        inputFormat: 'Single integer x',
        outputFormat: 'Boolean true or false',
        examples: [
          { input: '121', output: 'true', explanation: '121 reads as 121 from both sides.' },
          { input: '-121', output: 'false', explanation: 'From left to right it reads -121.' },
        ],
        testCases: [
          { input: '121', expectedOutput: 'true', isSample: true, marks: 25 },
          { input: '-121', expectedOutput: 'false', isSample: true, marks: 25 },
          { input: '10', expectedOutput: 'false', isSample: false, marks: 25 },
          { input: '12321', expectedOutput: 'true', isSample: false, marks: 25 },
        ],
      },
      {
        title: 'Longest Substring Without Repeating Characters',
        description:
          'Given a string s, find the length of the longest substring without repeating characters.',
        difficulty: 'Medium',
        topics: ['Sliding Window', 'Hash Table', 'Strings'],
        constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
        inputFormat: 'Single string s',
        outputFormat: 'Integer representing maximum length',
        examples: [
          { input: 'abcabcbb', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
          { input: 'bbbbb', output: '1', explanation: 'The answer is "b", with the length of 1.' },
        ],
        testCases: [
          { input: 'abcabcbb', expectedOutput: '3', isSample: true, marks: 20 },
          { input: 'bbbbb', expectedOutput: '1', isSample: true, marks: 20 },
          { input: 'pwwkew', expectedOutput: '3', isSample: false, marks: 30 },
          { input: ' ', expectedOutput: '1', isSample: false, marks: 30 },
        ],
        createdBy: alex._id,
      },
      {
        title: 'Container With Most Water',
        description:
          'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.',
        difficulty: 'Medium',
        topics: ['Two Pointers', 'Arrays', 'Greedy'],
        constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
        inputFormat: 'Comma-separated array of heights',
        outputFormat: 'Integer (maximum water)',
        examples: [
          { input: '[1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Max area between 8 and 7 is 49.' },
        ],
        testCases: [
          { input: '[1,8,6,2,5,4,8,3,7]', expectedOutput: '49', isSample: true, marks: 25 },
          { input: '[1,1]', expectedOutput: '1', isSample: true, marks: 25 },
          { input: '[4,3,2,1,4]', expectedOutput: '16', isSample: false, marks: 25 },
          { input: '[1,2,1]', expectedOutput: '2', isSample: false, marks: 25 },
        ],
        createdBy: sarah._id,
      },
      {
        title: '3Sum',
        description:
          'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.',
        difficulty: 'Medium',
        topics: ['Arrays', 'Two Pointers', 'Sorting'],
        constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
        inputFormat: 'Comma-separated array nums',
        outputFormat: 'Nested array of distinct triplets',
        examples: [
          { input: '[-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: 'Triplets sum to 0.' },
        ],
        testCases: [
          { input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]', isSample: true, marks: 30 },
          { input: '[0,1,1]', expectedOutput: '[]', isSample: true, marks: 30 },
          { input: '[0,0,0]', expectedOutput: '[[0,0,0]]', isSample: false, marks: 40 },
        ],
      },
      {
        title: 'Group Anagrams',
        description:
          'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
        difficulty: 'Medium',
        topics: ['Arrays', 'Hash Table', 'Strings', 'Sorting'],
        constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase letters.'],
        inputFormat: 'Array of strings',
        outputFormat: 'List of grouped anagram arrays',
        examples: [
          { input: '["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: 'Grouped by sorted signature.' },
        ],
        testCases: [
          { input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]', isSample: true, marks: 40 },
          { input: '[""]', expectedOutput: '[[""]]', isSample: false, marks: 30 },
          { input: '["a"]', expectedOutput: '[["a"]]', isSample: false, marks: 30 },
        ],
      },
      {
        title: 'Trapping Rain Water',
        description:
          'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
        difficulty: 'Hard',
        topics: ['Two Pointers', 'Dynamic Programming', 'Stack', 'Monotonic Stack'],
        constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
        inputFormat: 'Array of elevation heights',
        outputFormat: 'Total trapped rain units (integer)',
        examples: [
          { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: '6 units of water trapped.' },
          { input: '[4,2,0,3,2,5]', output: '9', explanation: '9 units of water trapped.' },
        ],
        testCases: [
          { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6', isSample: true, marks: 30 },
          { input: '[4,2,0,3,2,5]', expectedOutput: '9', isSample: true, marks: 30 },
          { input: '[2,0,2]', expectedOutput: '2', isSample: false, marks: 40 },
        ],
        createdBy: alex._id,
      },
      {
        title: 'Median of Two Sorted Arrays',
        description:
          'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).',
        difficulty: 'Hard',
        topics: ['Binary Search', 'Divide and Conquer', 'Arrays'],
        constraints: [
          'nums1.length == m',
          'nums2.length == n',
          '0 <= m, n <= 1000',
          '1 <= m + n <= 2000',
          '-10^6 <= nums1[i], nums2[i] <= 10^6',
        ],
        inputFormat: 'Line 1: array nums1\nLine 2: array nums2',
        outputFormat: 'Float (median)',
        examples: [
          { input: '[1,3]\n[2]', output: '2.00000', explanation: 'Merged array [1,2,3], median is 2.' },
          { input: '[1,2]\n[3,4]', output: '2.50000', explanation: 'Merged [1,2,3,4], median is (2+3)/2 = 2.5.' },
        ],
        testCases: [
          { input: '[1,3]\n[2]', expectedOutput: '2.0', isSample: true, marks: 40 },
          { input: '[1,2]\n[3,4]', expectedOutput: '2.5', isSample: true, marks: 30 },
          { input: '[0,0]\n[0,0]', expectedOutput: '0.0', isSample: false, marks: 30 },
        ],
      },
    ]);

    const [twoSum, validAnagram, revStr, palNum, longestSubstr, waterContainer, threeSum, groupAna, rainWater, medianArrays] = problems;

    console.log('[Seed Script] Seeding 5 battles (3 Completed, 1 Active, 1 Waiting)...');

    // 3. Battles
    // Battle 1: Completed (Two Sum) - Alex vs Sarah
    const battle1 = await Battle.create({
      battleId: 'BTL-ALPHA1',
      problem: twoSum._id,
      startTime: new Date(Date.now() - 3600000 * 5),
      endTime: new Date(Date.now() - 3600000 * 4.5),
      duration: 1800,
      status: 'Completed',
      winner: alex._id,
      participants: [
        { user: alex._id, isReady: true, joinedAt: new Date(Date.now() - 3600000 * 5) },
        { user: sarah._id, isReady: true, joinedAt: new Date(Date.now() - 3600000 * 5) },
      ],
      participantScores: [
        { user: alex._id, codingScore: 100, interviewScore: 95, totalScore: 195 },
        { user: sarah._id, codingScore: 80, interviewScore: 90, totalScore: 170 },
      ],
    });

    // Battle 2: Completed (Container With Most Water) - Alex vs Rohit
    const battle2 = await Battle.create({
      battleId: 'BTL-BETA02',
      problem: waterContainer._id,
      startTime: new Date(Date.now() - 3600000 * 3),
      endTime: new Date(Date.now() - 3600000 * 2.5),
      duration: 1800,
      status: 'Completed',
      winner: alex._id,
      participants: [
        { user: alex._id, isReady: true, joinedAt: new Date(Date.now() - 3600000 * 3) },
        { user: rohit._id, isReady: true, joinedAt: new Date(Date.now() - 3600000 * 3) },
      ],
      participantScores: [
        { user: alex._id, codingScore: 95, interviewScore: 90, totalScore: 185 },
        { user: rohit._id, codingScore: 70, interviewScore: 75, totalScore: 145 },
      ],
    });

    // Battle 3: Completed (Longest Substring) - Sarah vs Priya
    const battle3 = await Battle.create({
      battleId: 'BTL-GAMMA3',
      problem: longestSubstr._id,
      startTime: new Date(Date.now() - 3600000 * 2),
      endTime: new Date(Date.now() - 3600000 * 1.5),
      duration: 1800,
      status: 'Completed',
      winner: sarah._id,
      participants: [
        { user: sarah._id, isReady: true, joinedAt: new Date(Date.now() - 3600000 * 2) },
        { user: priya._id, isReady: true, joinedAt: new Date(Date.now() - 3600000 * 2) },
      ],
      participantScores: [
        { user: sarah._id, codingScore: 90, interviewScore: 85, totalScore: 175 },
        { user: priya._id, codingScore: 80, interviewScore: 85, totalScore: 165 },
      ],
    });

    // Battle 4: Active (Trapping Rain Water) - Alex vs Vikram
    const battle4 = await Battle.create({
      battleId: 'BTL-DELTA4',
      problem: rainWater._id,
      startTime: new Date(Date.now() - 600000), // 10 minutes ago
      duration: 1800,
      status: 'Active',
      participants: [
        { user: alex._id, isReady: true, joinedAt: new Date(Date.now() - 600000) },
        { user: vikram._id, isReady: true, joinedAt: new Date(Date.now() - 580000) },
      ],
    });

    // Battle 5: Waiting (3Sum) - Rohit waiting for opponent
    const battle5 = await Battle.create({
      battleId: 'BTL-EPSIL5',
      problem: threeSum._id,
      duration: 1800,
      status: 'Waiting',
      participants: [
        { user: rohit._id, isReady: true, joinedAt: new Date() },
      ],
    });

    console.log('[Seed Script] Seeding submissions...');

    // 4. Submissions for Battle 1 (Two Sum)
    // Alex's Submission (Accepted)
    const subAlexB1 = await Submission.create({
      user: alex._id,
      battle: battle1._id,
      problem: twoSum._id,
      sourceCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      language: 'javascript',
      status: 'Accepted',
      passedTestCases: 5,
      totalTestCases: 5,
      executionTime: 42,
      memoryUsed: 1240,
      codingScore: 100,
      isBestSubmission: true,
      executionResults: [
        { testCaseNumber: 1, isSample: true, status: 'Passed', actualOutput: '[0,1]', executionTime: 8 },
        { testCaseNumber: 2, isSample: true, status: 'Passed', actualOutput: '[1,2]', executionTime: 7 },
        { testCaseNumber: 3, isSample: false, status: 'Passed', actualOutput: '[0,1]', executionTime: 9 },
        { testCaseNumber: 4, isSample: false, status: 'Passed', actualOutput: '[2,4]', executionTime: 8 },
        { testCaseNumber: 5, isSample: false, status: 'Passed', actualOutput: '[0,3]', executionTime: 10 },
      ],
    });

    // Sarah's Submission (Partial / Wrong Answer on edge case)
    const subSarahB1 = await Submission.create({
      user: sarah._id,
      battle: battle1._id,
      problem: twoSum._id,
      sourceCode: `def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
      language: 'python',
      status: 'Accepted',
      passedTestCases: 4,
      totalTestCases: 5,
      executionTime: 180,
      memoryUsed: 2400,
      codingScore: 80,
      isBestSubmission: true,
      executionResults: [
        { testCaseNumber: 1, isSample: true, status: 'Passed', actualOutput: '[0,1]', executionTime: 15 },
        { testCaseNumber: 2, isSample: true, status: 'Passed', actualOutput: '[1,2]', executionTime: 14 },
        { testCaseNumber: 3, isSample: false, status: 'Passed', actualOutput: '[0,1]', executionTime: 16 },
        { testCaseNumber: 4, isSample: false, status: 'Passed', actualOutput: '[2,4]', executionTime: 18 },
        { testCaseNumber: 5, isSample: false, status: 'Failed', actualOutput: 'Time Limit Exceeded', executionTime: 117 },
      ],
    });

    // Submissions for Battle 2 (Container With Most Water)
    const subAlexB2 = await Submission.create({
      user: alex._id,
      battle: battle2._id,
      problem: waterContainer._id,
      sourceCode: `function maxArea(height) {
  let left = 0, right = height.length - 1;
  let maxWater = 0;
  while (left < right) {
    const width = right - left;
    maxWater = Math.max(maxWater, Math.min(height[left], height[right]) * width);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxWater;
}`,
      language: 'javascript',
      status: 'Accepted',
      passedTestCases: 4,
      totalTestCases: 4,
      executionTime: 55,
      memoryUsed: 1450,
      codingScore: 95,
      isBestSubmission: true,
      executionResults: [
        { testCaseNumber: 1, isSample: true, status: 'Passed', actualOutput: '49', executionTime: 12 },
        { testCaseNumber: 2, isSample: true, status: 'Passed', actualOutput: '1', executionTime: 10 },
        { testCaseNumber: 3, isSample: false, status: 'Passed', actualOutput: '16', executionTime: 15 },
        { testCaseNumber: 4, isSample: false, status: 'Passed', actualOutput: '2', executionTime: 18 },
      ],
    });

    const subRohitB2 = await Submission.create({
      user: rohit._id,
      battle: battle2._id,
      problem: waterContainer._id,
      sourceCode: `public class Solution {
    public int maxArea(int[] height) {
        int max = 0;
        for (int i = 0; i < height.length; i++) {
            for (int j = i + 1; j < height.length; j++) {
                max = Math.max(max, Math.min(height[i], height[j]) * (j - i));
            }
        }
        return max;
    }
}`,
      language: 'java',
      status: 'Wrong Answer',
      passedTestCases: 3,
      totalTestCases: 4,
      executionTime: 320,
      memoryUsed: 5120,
      codingScore: 70,
      isBestSubmission: true,
      executionResults: [
        { testCaseNumber: 1, isSample: true, status: 'Passed', actualOutput: '49', executionTime: 20 },
        { testCaseNumber: 2, isSample: true, status: 'Passed', actualOutput: '1', executionTime: 18 },
        { testCaseNumber: 3, isSample: false, status: 'Passed', actualOutput: '16', executionTime: 22 },
        { testCaseNumber: 4, isSample: false, status: 'Failed', actualOutput: 'Time Limit Exceeded', executionTime: 260 },
      ],
    });

    // Submissions for Battle 3 (Longest Substring)
    const subSarahB3 = await Submission.create({
      user: sarah._id,
      battle: battle3._id,
      problem: longestSubstr._id,
      sourceCode: `def lengthOfLongestSubstring(s: str) -> int:
    char_map = {}
    left = 0
    max_len = 0
    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
      language: 'python',
      status: 'Accepted',
      passedTestCases: 4,
      totalTestCases: 4,
      executionTime: 48,
      memoryUsed: 1890,
      codingScore: 90,
      isBestSubmission: true,
      executionResults: [
        { testCaseNumber: 1, isSample: true, status: 'Passed', actualOutput: '3', executionTime: 10 },
        { testCaseNumber: 2, isSample: true, status: 'Passed', actualOutput: '1', executionTime: 12 },
        { testCaseNumber: 3, isSample: false, status: 'Passed', actualOutput: '3', executionTime: 11 },
        { testCaseNumber: 4, isSample: false, status: 'Passed', actualOutput: '1', executionTime: 15 },
      ],
    });

    const subPriyaB3 = await Submission.create({
      user: priya._id,
      battle: battle3._id,
      problem: longestSubstr._id,
      sourceCode: `function lengthOfLongestSubstring(s) {
  let set = new Set();
  let left = 0, max = 0;
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    max = Math.max(max, right - left + 1);
  }
  return max;
}`,
      language: 'javascript',
      status: 'Accepted',
      passedTestCases: 4,
      totalTestCases: 4,
      executionTime: 65,
      memoryUsed: 1300,
      codingScore: 80,
      isBestSubmission: true,
      executionResults: [
        { testCaseNumber: 1, isSample: true, status: 'Passed', actualOutput: '3', executionTime: 14 },
        { testCaseNumber: 2, isSample: true, status: 'Passed', actualOutput: '1', executionTime: 13 },
        { testCaseNumber: 3, isSample: false, status: 'Passed', actualOutput: '3', executionTime: 18 },
        { testCaseNumber: 4, isSample: false, status: 'Passed', actualOutput: '1', executionTime: 20 },
      ],
    });

    console.log('[Seed Script] Seeding AI interview sessions...');

    // 5. Interviews
    // Interview for Alex (Battle 1)
    const interviewAlexB1 = await Interview.create({
      user: alex._id,
      battle: battle1._id,
      submission: subAlexB1._id,
      evaluationStatus: 'Completed',
      totalInterviewScore: 95,
      questions: [
        {
          questionText: 'What is the time and space complexity of your HashMap solution for Two Sum?',
          questionType: 'Complexity',
          relatedCodeSection: 'const map = new Map();',
          expectedConcepts: ['O(N) time complexity', 'O(N) auxiliary space'],
          difficulty: 'Easy',
          maximumMarks: 50,
        },
        {
          questionText: 'Why did you choose a one-pass Hash Table instead of two passes or sorting with two pointers?',
          questionType: 'AlgorithmExplanation',
          relatedCodeSection: 'if (map.has(complement)) return [map.get(complement), i];',
          expectedConcepts: ['One-pass lookup', 'Preserves original indices without sorting overhead'],
          difficulty: 'Medium',
          maximumMarks: 50,
        },
      ],
      participantResponses: [
        {
          questionIndex: 0,
          questionText: 'What is the time and space complexity of your HashMap solution for Two Sum?',
          answer: 'The time complexity is O(N) because we iterate through the array once and Map lookups are average O(1). The space complexity is O(N) to store up to N elements in the hash map.',
          awardedMarks: 48,
          feedback: 'Accurate and concise complexity analysis.',
          evaluatedAt: new Date(Date.now() - 3600000 * 4.6),
        },
        {
          questionIndex: 1,
          questionText: 'Why did you choose a one-pass Hash Table instead of two passes or sorting with two pointers?',
          answer: 'Sorting the array takes O(N log N) time and loses original indices, requiring extra storage. A one-pass hash map checks for the complement while inserting, keeping both time and code optimal.',
          awardedMarks: 47,
          feedback: 'Excellent trade-off justification and understanding of algorithmic constraints.',
          evaluatedAt: new Date(Date.now() - 3600000 * 4.55),
        },
      ],
    });

    // Interview for Sarah (Battle 1)
    const interviewSarahB1 = await Interview.create({
      user: sarah._id,
      battle: battle1._id,
      submission: subSarahB1._id,
      evaluationStatus: 'Completed',
      totalInterviewScore: 90,
      questions: [
        {
          questionText: 'Your current solution uses nested loops. How would you optimize it from O(N^2) to O(N)?',
          questionType: 'Optimization',
          relatedCodeSection: 'for i in range(len(nums)): for j in range(i+1, len(nums)):',
          expectedConcepts: ['Dictionary / Hash Map', 'Trade space for time'],
          difficulty: 'Medium',
          maximumMarks: 50,
        },
        {
          questionText: 'What edge cases could cause performance degradation in large inputs?',
          questionType: 'EdgeCase',
          relatedCodeSection: 'if nums[i] + nums[j] == target',
          expectedConcepts: ['10^4 elements leading to 10^8 operations (TLE)'],
          difficulty: 'Medium',
          maximumMarks: 50,
        },
      ],
      participantResponses: [
        {
          questionIndex: 0,
          questionText: 'Your current solution uses nested loops. How would you optimize it from O(N^2) to O(N)?',
          answer: 'I would use a Python dictionary where each key is the number and value is its index. In one loop, we compute complement = target - num and check if complement exists in dictionary in O(1) time.',
          awardedMarks: 46,
          feedback: 'Clear understanding of hash map optimization.',
          evaluatedAt: new Date(Date.now() - 3600000 * 4.6),
        },
        {
          questionIndex: 1,
          questionText: 'What edge cases could cause performance degradation in large inputs?',
          answer: 'When array size is 10^4, O(N^2) causes 10^8 comparisons which hits Python execution time limits and results in TLE.',
          awardedMarks: 44,
          feedback: 'Correct identification of the TLE test case failure.',
          evaluatedAt: new Date(Date.now() - 3600000 * 4.55),
        },
      ],
    });

    console.log('[Seed Script] Seeding final battle results...');

    // 6. Results
    // Battle 1 Results (Alex: Rank 1, Sarah: Rank 2)
    await Result.create([
      {
        battle: battle1._id,
        user: alex._id,
        submission: subAlexB1._id,
        interview: interviewAlexB1._id,
        codingScore: 100,
        interviewScore: 95,
        totalScore: 195,
        accuracy: 100,
        executionTime: 42,
        rank: 1,
        strengths: ['Optimal O(N) Hash Table implementation', 'Strong Big-O theoretical articulation', 'Fast execution speed'],
        weaknesses: ['Could add explicit comments on variable constraints'],
        improvementSuggestions: ['Practice hard graph and tree problems next'],
        aiPerformanceReport: {
          summary: 'Outstanding performance across both coding and verbal interview. Demonstrated master-level algorithm formulation and optimal complexity tradeoffs.',
          codeEfficiencyReview: 'Memory and execution time were within top 5% of submissions.',
          interviewDepthReview: 'Clear, concise explanations without hesitation.',
          recommendedPracticeTopics: ['Dynamic Programming on Trees', 'Segment Trees'],
        },
        completedAt: new Date(Date.now() - 3600000 * 4.5),
      },
      {
        battle: battle1._id,
        user: sarah._id,
        submission: subSarahB1._id,
        interview: interviewSarahB1._id,
        codingScore: 80,
        interviewScore: 90,
        totalScore: 170,
        accuracy: 80,
        executionTime: 180,
        rank: 2,
        strengths: ['Clear interview communication', 'Identified theoretical optimization during Q&A'],
        weaknesses: ['Submitted O(N^2) brute force leading to TLE on large hidden testcase'],
        improvementSuggestions: ['Always evaluate time complexity against input constraints (N=10^4) before coding'],
        aiPerformanceReport: {
          summary: 'Solid verbal interview recovery after encountering a TLE in the code submission phase.',
          codeEfficiencyReview: 'Nested loop approach exceeded the 1.0s limit on hidden testcase #5.',
          interviewDepthReview: 'Explained the dictionary optimization method clearly.',
          recommendedPracticeTopics: ['Hash Table Patterns', 'Sliding Window'],
        },
        completedAt: new Date(Date.now() - 3600000 * 4.5),
      },
    ]);

    // Battle 2 Results (Alex: Rank 1, Rohit: Rank 2)
    await Result.create([
      {
        battle: battle2._id,
        user: alex._id,
        submission: subAlexB2._id,
        interview: null,
        codingScore: 95,
        interviewScore: 90,
        totalScore: 185,
        accuracy: 100,
        executionTime: 55,
        rank: 1,
        strengths: ['Optimal Two Pointers strategy', 'Clean JavaScript code'],
        weaknesses: [],
        improvementSuggestions: ['Keep up the consistent problem solving'],
        aiPerformanceReport: {
          summary: 'Efficient two-pointer approach correctly narrowing bounds.',
          codeEfficiencyReview: 'O(N) time and O(1) auxiliary space achieved.',
          interviewDepthReview: 'High confidence on greedy proofs.',
          recommendedPracticeTopics: ['Binary Search on Answer'],
        },
        completedAt: new Date(Date.now() - 3600000 * 2.5),
      },
      {
        battle: battle2._id,
        user: rohit._id,
        submission: subRohitB2._id,
        interview: null,
        codingScore: 70,
        interviewScore: 75,
        totalScore: 145,
        accuracy: 75,
        executionTime: 320,
        rank: 2,
        strengths: ['Correct nested loop logic'],
        weaknesses: ['TLE on large arrays', 'High memory usage in Java solution'],
        improvementSuggestions: ['Explore two-pointer patterns to avoid O(N^2) passes'],
        aiPerformanceReport: {
          summary: 'Needs to identify two pointer opportunities in array maximization problems.',
          codeEfficiencyReview: 'Brute force approach timed out on maximum input constraint.',
          interviewDepthReview: 'Understands basic concepts but needs practice on optimization patterns.',
          recommendedPracticeTopics: ['Two Pointers', 'Prefix Sums'],
        },
        completedAt: new Date(Date.now() - 3600000 * 2.5),
      },
    ]);

    // Battle 3 Results (Sarah: Rank 1, Priya: Rank 2)
    await Result.create([
      {
        battle: battle3._id,
        user: sarah._id,
        submission: subSarahB3._id,
        interview: null,
        codingScore: 90,
        interviewScore: 85,
        totalScore: 175,
        accuracy: 100,
        executionTime: 48,
        rank: 1,
        strengths: ['Sliding window with character index jump', 'Pythonic and clean code'],
        weaknesses: ['Minor edge case hesitation in interview'],
        improvementSuggestions: ['Add space complexity comments'],
        aiPerformanceReport: {
          summary: 'Strong win using optimal sliding window technique.',
          codeEfficiencyReview: 'O(N) time single-pass implementation.',
          interviewDepthReview: 'Well articulated sliding window logic.',
          recommendedPracticeTopics: ['Monotonic Queue', 'String Hashing'],
        },
        completedAt: new Date(Date.now() - 3600000 * 1.5),
      },
      {
        battle: battle3._id,
        user: priya._id,
        submission: subPriyaB3._id,
        interview: null,
        codingScore: 80,
        interviewScore: 85,
        totalScore: 165,
        accuracy: 100,
        executionTime: 65,
        rank: 2,
        strengths: ['Correct Set sliding window implementation', 'Articulate interview answers'],
        weaknesses: ['Two steps per character instead of index jump lookup'],
        improvementSuggestions: ['Store last seen index in Map instead of deleting elements one by one from Set'],
        aiPerformanceReport: {
          summary: 'Close match! Passed all test cases, slight difference in execution efficiency and code score.',
          codeEfficiencyReview: 'Set deletion while-loop causes 2N operations instead of N with map.',
          interviewDepthReview: 'Great explanation of window expansion and contraction.',
          recommendedPracticeTopics: ['Hash Map Optimization', 'Two Pointers'],
        },
        completedAt: new Date(Date.now() - 3600000 * 1.5),
      },
    ]);

    console.log('====================================================');
    console.log('🎉 Code Armada Database successfully seeded!');
    console.log(`👤 Users seeded: ${users.length}`);
    console.log(`🧩 Problems seeded: ${problems.length}`);
    console.log(`⚔️  Battles seeded: 5 (3 Completed, 1 Active, 1 Waiting)`);
    console.log(`📝 Submissions seeded: 6`);
    console.log(`🤖 Interviews seeded: 2`);
    console.log(`🏆 Results seeded: 6`);
    console.log('====================================================');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
};

seedDatabase();
