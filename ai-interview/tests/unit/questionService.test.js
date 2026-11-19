const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const QuestionService = require('../../src/services/questionService');
const { MockProvider } = require('../../src/services/ai');

describe('Feature B: Question Service', () => {
  const sampleParams = {
    problemStatement: 'Search a target in a sorted integer array.',
    language: 'java',
    sourceCode: 'class Solution { public int search(int[] nums, int target) { ... } }',
    analysis: {
      algorithm: 'Binary Search',
      approach: 'Halve the search space iteratively',
      dataStructures: ['Array'],
      timeComplexity: { value: 'O(log n)', explanation: 'Logarithmic reduction' },
      spaceComplexity: { value: 'O(1)', explanation: 'Two pointers' },
      edgeCases: ['Empty array', 'Target not found'],
      possibleImprovements: ['Prevent integer overflow'],
    },
  };

  test('should generate 5 personalized questions matching the 5 required categories', async () => {
    const service = new QuestionService(new MockProvider());
    const questions = await service.generateQuestions(sampleParams);

    assert.equal(questions.length, 5);

    const categories = questions.map((q) => q.category);
    assert.ok(categories.includes('algorithm_understanding'));
    assert.ok(categories.includes('time_complexity'));
    assert.ok(categories.includes('space_complexity'));
    assert.ok(categories.includes('edge_cases'));
    assert.ok(categories.includes('optimization_tradeoffs'));

    // Check individual question structure
    const firstQ = questions[0];
    assert.ok(firstQ.questionId);
    assert.ok(firstQ.question);
    assert.ok(firstQ.difficulty);
    assert.ok(Array.isArray(firstQ.expectedConcepts));
    assert.ok(firstQ.maxScore > 0);
  });

  test('assigned rubric scores across all 5 questions must total 100 marks', async () => {
    const service = new QuestionService(new MockProvider());
    const questions = await service.generateQuestions(sampleParams);

    const totalMarks = questions.reduce((sum, q) => sum + q.maxScore, 0);
    assert.equal(totalMarks, 100);

    const scoreMap = Object.fromEntries(questions.map((q) => [q.category, q.maxScore]));
    assert.equal(scoreMap.algorithm_understanding, 25);
    assert.equal(scoreMap.time_complexity, 20);
    assert.equal(scoreMap.space_complexity, 15);
    assert.equal(scoreMap.edge_cases, 20);
    assert.equal(scoreMap.optimization_tradeoffs, 20);
  });

  test('should throw an error when required parameters are missing', async () => {
    const service = new QuestionService(new MockProvider());

    await assert.rejects(
      async () => service.generateQuestions({ problemStatement: 'test' }),
      /Problem statement, language, source code, and analysis are required/
    );
  });

  test('should fail when AI returns an empty question list', async () => {
    const mockProvider = new MockProvider({ nextResponse: { questions: [] } });
    const service = new QuestionService(mockProvider);

    await assert.rejects(
      async () => service.generateQuestions(sampleParams),
      /AI response did not contain an array of questions/
    );
  });
});
