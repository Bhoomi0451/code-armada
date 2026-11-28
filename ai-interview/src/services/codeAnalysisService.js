const InputValidator = require('../validators/inputValidator');
const JsonValidator = require('../validators/jsonValidator');
const buildAnalysisPrompt = require('../prompts/analysisPrompt');
const { createAIProvider } = require('./ai');

/**
 * Service responsible for Feature A: Analyzing submitted DSA code.
 */
class CodeAnalysisService {
  constructor(aiProvider = null) {
    this.aiProvider = aiProvider || createAIProvider();
  }

  /**
   * Analyzes candidate's submitted source code.
   * @param {Object} rawInput
   * @returns {Promise<Object>} Structured analysis result
   */
  async analyzeCode(rawInput) {
    // 1. Validate and sanitize input
    const validatedInput = InputValidator.validateSubmissionInput(rawInput);

    // 2. Build anti-injection prompt and schema
    const { systemPrompt, userPrompt, schema } = buildAnalysisPrompt(validatedInput);

    // 3. Call AI provider
    const completionText = await this.aiProvider.generateCompletion({
      systemPrompt,
      userPrompt,
      responseSchema: schema,
    });

    // 4. Safely parse and validate JSON output
    const parsedData = JsonValidator.parse(completionText);
    JsonValidator.validate(parsedData, schema);

    // 5. Attach metadata for traceability
    return {
      matchId: validatedInput.matchId,
      userId: validatedInput.userId,
      problemId: validatedInput.problemId,
      language: validatedInput.language,
      analysis: parsedData,
      analyzedAt: new Date().toISOString(),
    };
  }
}

module.exports = CodeAnalysisService;
