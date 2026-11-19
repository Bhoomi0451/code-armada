const config = require('../config');

/**
 * Validates and sanitizes inputs for the AI Interview module.
 */
class InputValidator {
  /**
   * Validates code submission payload for Feature A.
   * @param {Object} payload
   */
  static validateSubmissionInput(payload) {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Payload must be a non-empty object.');
    }

    const { matchId, userId, problemId, problemStatement, language, sourceCode } = payload;

    const requiredFields = {
      matchId: 'string',
      userId: 'string',
      problemId: 'string',
      problemStatement: 'string',
      language: 'string',
      sourceCode: 'string',
    };

    for (const [field, expectedType] of Object.entries(requiredFields)) {
      if (!payload[field] || typeof payload[field] !== expectedType) {
        throw new Error(`Invalid or missing field: "${field}". Expected non-empty ${expectedType}.`);
      }
      if (typeof payload[field] === 'string' && payload[field].trim().length === 0) {
        throw new Error(`Field "${field}" cannot be blank.`);
      }
    }

    if (sourceCode.length > config.limits.maxCodeLength) {
      throw new Error(
        `Source code length (${sourceCode.length}) exceeds maximum allowed limit (${config.limits.maxCodeLength} chars).`
      );
    }

    return {
      matchId: matchId.trim(),
      userId: userId.trim(),
      problemId: problemId.trim(),
      problemStatement: problemStatement.trim(),
      language: language.trim().toLowerCase(),
      sourceCode: sourceCode,
      executionResult: payload.executionResult || 'ACCEPTED',
      testCaseResults: payload.testCaseResults || null,
    };
  }

  /**
   * Validates user answer submitted during the interview.
   * @param {string} answer
   */
  static validateAnswer(answer) {
    if (typeof answer !== 'string' || answer.trim().length === 0) {
      throw new Error('Answer must be a non-empty string.');
    }

    if (answer.length > config.limits.maxAnswerLength) {
      throw new Error(
        `Answer length (${answer.length}) exceeds maximum allowed limit (${config.limits.maxAnswerLength} chars).`
      );
    }

    return answer.trim();
  }
}

module.exports = InputValidator;
