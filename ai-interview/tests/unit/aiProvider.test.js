const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const config = require('../../src/config');
const { createAIProvider, MockProvider } = require('../../src/services/ai');

describe('Step 1: Configuration & AI Provider Abstraction', () => {
  test('Config should load default rubric matching requirements', () => {
    assert.equal(config.rubric.totalMarks, 100);
    assert.equal(config.rubric.algorithmUnderstanding, 25);
    assert.equal(config.rubric.timeComplexity, 20);
    assert.equal(config.rubric.spaceComplexity, 15);
    assert.equal(config.rubric.edgeCases, 20);
    assert.equal(config.rubric.optimizationTradeoffs, 20);
  });

  test('MockProvider should return valid JSON for code analysis prompt', async () => {
    const provider = new MockProvider();
    const result = await provider.generateCompletion({
      systemPrompt: 'System instruction',
      userPrompt: 'Analyze the following DSA solution in Java',
    });

    const parsed = JSON.parse(result);
    assert.equal(parsed.algorithm, 'Binary Search');
    assert.equal(parsed.timeComplexity.value, 'O(log n)');
    assert.ok(Array.isArray(parsed.edgeCases));
  });

  test('MockProvider should allow overriding responses for testing edge cases', async () => {
    const customResponse = { customKey: 'customValue' };
    const provider = new MockProvider({ nextResponse: customResponse });

    const result = await provider.generateCompletion({
      systemPrompt: '',
      userPrompt: 'Any prompt',
    });

    const parsed = JSON.parse(result);
    assert.equal(parsed.customKey, 'customValue');
  });

  test('createAIProvider should return MockProvider when specified', () => {
    const provider = createAIProvider('mock');
    assert.equal(provider.getName(), 'mock');
  });
});
