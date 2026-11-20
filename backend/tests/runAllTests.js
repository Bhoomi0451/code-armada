import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import Problem from '../src/models/Problem.js';
import Battle from '../src/models/Battle.js';
import Submission from '../src/models/Submission.js';
import Interview from '../src/models/Interview.js';
import Result from '../src/models/Result.js';

let authToken = '';
let testUserId = '';
let testUser2Id = '';
let testProblemId = '';
let testBattleId = '';
let testSubmissionId = '';
let testInterviewId = '';

test.before(async () => {
  // Ensure connected to MongoDB before running tests
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
});

test.after(async () => {
  // Cleanup any test created artifacts with prefix 'test_'
  await User.deleteMany({ email: /@testrunner\.dev$/ });
  await Problem.deleteMany({ title: /^TEST_/ });
  await Battle.deleteMany({ battleId: /^BTL-TEST/ });
  await disconnectDB();
});

test('1. MongoDB Connection and Health Check', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'Healthy');
  assert.equal(res.body.database.status, 'Connected');
});

test('2. User Registration with Password Hashing & Sanitization', async () => {
  const uniqueSuffix = Date.now();
  const res = await request(app)
    .post('/api/users/register')
    .send({
      username: `tester_${uniqueSuffix}`,
      fullName: 'Test Candidate',
      email: `candidate_${uniqueSuffix}@testrunner.dev`,
      password: 'secretPassword123',
      college: 'Delhi Technological University',
      skills: ['C++', 'Python'],
    });

  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.token, 'JWT token must be returned');
  assert.ok(res.body.data.user._id, 'User ID must be returned');
  assert.equal(res.body.data.user.password, undefined, 'Password hash must never be returned');

  authToken = res.body.data.token;
  testUserId = res.body.data.user._id;

  // Create a second user for 1v1 battle testing
  const res2 = await request(app)
    .post('/api/users/register')
    .send({
      username: `opponent_${uniqueSuffix}`,
      fullName: 'Test Opponent',
      email: `opponent_${uniqueSuffix}@testrunner.dev`,
      password: 'secretPassword123',
      college: 'IIT Delhi',
      skills: ['Java'],
    });
  assert.equal(res2.status, 201);
  testUser2Id = res2.body.data.user._id;
});

test('3. Duplicate Email Validation Error Handling', async () => {
  const user = await User.findById(testUserId);
  const res = await request(app)
    .post('/api/users/register')
    .send({
      username: `different_name_${Date.now()}`,
      fullName: 'Duplicate Tester',
      email: user.email, // Same email
      password: 'password123',
    });

  assert.equal(res.status, 409, 'Must return 409 Conflict for duplicate email');
  assert.equal(res.body.success, false);
});

test('4. User Login and JWT Verification', async () => {
  const user = await User.findById(testUserId);
  const res = await request(app)
    .post('/api/users/login')
    .send({
      email: user.email,
      password: 'secretPassword123',
    });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.token);
});

test('5. Retrieve User Profile & Detailed Statistics', async () => {
  const profileRes = await request(app).get(`/api/users/${testUserId}`);
  assert.equal(profileRes.status, 200);
  assert.equal(profileRes.body.data.password, undefined);

  const statsRes = await request(app).get(`/api/users/${testUserId}/stats`);
  assert.equal(statsRes.status, 200);
  assert.equal(statsRes.body.success, true);
  assert.ok(statsRes.body.data.summary);
});

test('6. Problem Creation with Sample and Hidden Testcases', async () => {
  const res = await request(app)
    .post('/api/problems')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      title: `TEST_Problem_${Date.now()}`,
      description: 'Find if array contains duplicate element.',
      difficulty: 'Easy',
      topics: ['Arrays', 'Hash Table'],
      constraints: ['1 <= nums.length <= 10^5'],
      inputFormat: 'Comma-separated array',
      outputFormat: 'Boolean true or false',
      examples: [{ input: '[1,2,3,1]', output: 'true', explanation: '1 appears twice' }],
      testCases: [
        { input: '[1,2,3,1]', expectedOutput: 'true', isSample: true, marks: 20 },
        { input: '[1,2,3,4]', expectedOutput: 'false', isSample: true, marks: 20 },
        { input: '[1,1,1,3,3,4,3,2,4,2]', expectedOutput: 'true', isSample: false, marks: 30 },
        { input: '[0]', expectedOutput: 'false', isSample: false, marks: 30 },
      ],
    });

  assert.equal(res.status, 201);
  assert.ok(res.body.data._id);
  testProblemId = res.body.data._id;
});

test('7. Hidden Test Case Protection on Public Problem Fetch', async () => {
  const res = await request(app).get(`/api/problems/${testProblemId}`);
  assert.equal(res.status, 200);

  const testCases = res.body.data.testCases;
  assert.ok(Array.isArray(testCases));
  // Verify that ONLY sample test cases are returned publicly
  const hiddenExposed = testCases.some((tc) => tc.isSample === false);
  assert.equal(hiddenExposed, false, 'Hidden test cases must NEVER be exposed publicly');
  assert.equal(testCases.length, 2, 'Should only return the 2 sample test cases');
});

test('8. Problem Filtering by Difficulty and Topic', async () => {
  const res = await request(app).get('/api/problems?difficulty=Easy&topic=Arrays');
  assert.equal(res.status, 200);
  assert.ok(res.body.data.problems.length > 0);
  assert.equal(res.body.data.problems[0].difficulty, 'Easy');
});

test('9. 1v1 Battle Creation in Waiting State', async () => {
  const res = await request(app)
    .post('/api/battles')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      problemId: testProblemId,
      userId: testUserId,
      duration: 1200,
    });

  assert.equal(res.status, 201);
  assert.equal(res.body.data.status, 'Waiting');
  assert.equal(res.body.data.participants.length, 1);
  testBattleId = res.body.data._id;
});

test('10. 1v1 Battle Joining and Automatic Activation', async () => {
  const res = await request(app)
    .post(`/api/battles/${testBattleId}/join`)
    .send({
      userId: testUser2Id,
    });

  assert.equal(res.status, 200);
  assert.equal(res.body.data.status, 'Active');
  assert.equal(res.body.data.participants.length, 2);
  assert.ok(res.body.data.startTime);
});

test('11. Battle State Machine Validation: Prevent Invalid Transitions', async () => {
  // Attempting to transition from Active directly to Waiting (invalid)
  const res = await request(app)
    .patch(`/api/battles/${testBattleId}/status`)
    .send({
      status: 'Waiting',
    });

  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
});

test('12. Submission Storage and Coding Score Calculation', async () => {
  const res = await request(app)
    .post('/api/submissions')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      battleId: testBattleId,
      problemId: testProblemId,
      userId: testUserId,
      sourceCode: 'function containsDuplicate(nums) { return new Set(nums).size !== nums.length; }',
      language: 'javascript',
      executionTime: 45,
      memoryUsed: 1200,
      executionResults: [
        { testCaseNumber: 1, isSample: true, status: 'Passed', actualOutput: 'true', executionTime: 10 },
        { testCaseNumber: 2, isSample: true, status: 'Passed', actualOutput: 'false', executionTime: 10 },
        { testCaseNumber: 3, isSample: false, status: 'Passed', actualOutput: 'true', executionTime: 12 },
        { testCaseNumber: 4, isSample: false, status: 'Passed', actualOutput: 'false', executionTime: 13 },
      ],
    });

  assert.equal(res.status, 201);
  assert.equal(res.body.data.status, 'Accepted');
  assert.equal(res.body.data.codingScore, 100);
  assert.equal(res.body.data.passedTestCases, 4);
  assert.equal(res.body.data.isBestSubmission, true);
  testSubmissionId = res.body.data._id;
});

test('13. Best Submission Retrieval for Participant', async () => {
  const res = await request(app).get(
    `/api/submissions/battle/${testBattleId}/best/${testUserId}`
  );
  assert.equal(res.status, 200);
  assert.equal(res.body.data.isBestSubmission, true);
  assert.equal(res.body.data.codingScore, 100);
});

test('14. AI Interview Initialization with Code-Linked Questions', async () => {
  const res = await request(app)
    .post('/api/interviews')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      battleId: testBattleId,
      submissionId: testSubmissionId,
      userId: testUserId,
      questions: [
        {
          questionText: 'What is the time complexity of Set insertion in JavaScript?',
          questionType: 'Complexity',
          relatedCodeSection: 'new Set(nums)',
          expectedConcepts: ['O(1) average lookup/insert', 'O(N) total construction'],
          difficulty: 'Easy',
          maximumMarks: 50,
        },
        {
          questionText: 'How would you solve this with O(1) auxiliary space?',
          questionType: 'Optimization',
          relatedCodeSection: 'return new Set(nums).size !== nums.length;',
          expectedConcepts: ['Sort in-place or check adjacent elements'],
          difficulty: 'Medium',
          maximumMarks: 50,
        },
      ],
    });

  assert.equal(res.status, 201);
  assert.equal(res.body.data.questions.length, 2);
  assert.equal(res.body.data.evaluationStatus, 'Pending');
  testInterviewId = res.body.data._id;
});

test('15. Interview Response Submission and AI Evaluation', async () => {
  // 1. Submit participant responses
  const respRes = await request(app)
    .post(`/api/interviews/${testInterviewId}/responses`)
    .send({
      responses: [
        {
          questionIndex: 0,
          answer: 'Set construction from an array of N elements takes O(N) time because each element is inserted in average O(1) time.',
        },
        {
          questionIndex: 1,
          answer: 'We could sort the array in-place using Heapsort in O(N log N) time and O(1) space, then check if nums[i] == nums[i+1].',
        },
      ],
    });

  assert.equal(respRes.status, 200);
  assert.equal(respRes.body.data.evaluationStatus, 'In Progress');

  // 2. AI Evaluates responses
  const evalRes = await request(app)
    .patch(`/api/interviews/${testInterviewId}/evaluate`)
    .send({
      evaluations: [
        { questionIndex: 0, awardedMarks: 48, feedback: 'Precise complexity analysis.' },
        { questionIndex: 1, awardedMarks: 46, feedback: 'Strong alternative tradeoff proposal.' },
      ],
    });

  assert.equal(evalRes.status, 200);
  assert.equal(evalRes.body.data.evaluationStatus, 'Completed');
  assert.equal(evalRes.body.data.totalInterviewScore, 94);
});

test('16. Final Result Creation, Ranking, and Duplicate Prevention', async () => {
  // Create submission for Opponent so both have completed
  const subOpponent = await Submission.create({
    user: testUser2Id,
    battle: testBattleId,
    problem: testProblemId,
    sourceCode: 'function containsDuplicate(nums) { return false; }',
    language: 'javascript',
    status: 'Wrong Answer',
    passedTestCases: 1,
    totalTestCases: 4,
    codingScore: 25,
    isBestSubmission: true,
  });

  // 1. Create Result for candidate
  const res1 = await request(app)
    .post('/api/results')
    .send({
      battleId: testBattleId,
      userId: testUserId,
      submissionId: testSubmissionId,
      interviewId: testInterviewId,
      codingScore: 100,
      interviewScore: 94,
      accuracy: 100,
      executionTime: 45,
      strengths: ['Set optimization', 'Clear interview reasoning'],
      weaknesses: [],
      improvementSuggestions: ['Explore bit manipulation tricks'],
    });

  assert.equal(res1.status, 201);
  assert.equal(res1.body.data.totalScore, 194);

  // 2. Prevent duplicate result for same user and battle
  const duplicateRes = await request(app)
    .post('/api/results')
    .send({
      battleId: testBattleId,
      userId: testUserId,
      submissionId: testSubmissionId,
    });
  assert.equal(duplicateRes.status, 409, 'Must return 409 for duplicate battle result');

  // 3. Create Result for opponent to finalize match
  const res2 = await request(app)
    .post('/api/results')
    .send({
      battleId: testBattleId,
      userId: testUser2Id,
      submissionId: subOpponent._id,
      codingScore: 25,
      interviewScore: 30,
      accuracy: 25,
      executionTime: 80,
    });
  assert.equal(res2.status, 201);

  // Verify Battle transitioned to Completed with Winner determined
  const battleCheck = await Battle.findById(testBattleId);
  assert.equal(battleCheck.status, 'Completed');
  assert.equal(battleCheck.winner.toString(), testUserId.toString(), 'Candidate must be the winner');
});

test('17. Global Leaderboard Aggregation Pipeline Verification', async () => {
  const res = await request(app).get('/api/results/leaderboard');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body.data.entries));
  assert.ok(res.body.data.entries.length > 0);

  // Verify rankings are in descending order of performance score
  const entries = res.body.data.entries;
  for (let i = 0; i < entries.length - 1; i++) {
    assert.ok(
      entries[i].totalPerformanceScore >= entries[i + 1].totalPerformanceScore,
      'Leaderboard must sort descending by totalPerformanceScore'
    );
  }
});

test('18. Error Handling: Invalid MongoDB ObjectId (CastError)', async () => {
  const res = await request(app).get('/api/users/not-a-valid-mongodb-id');
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
  assert.match(res.body.message, /Invalid ID format/i);
});

test('19. Error Handling: 404 Route Not Found', async () => {
  const res = await request(app).get('/api/unregistered-route-xyz');
  assert.equal(res.status, 404);
  assert.equal(res.body.success, false);
});
