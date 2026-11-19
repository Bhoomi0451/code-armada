/**
 * Abstract Base Class for AI Providers.
 * Ensures Gemini, Grok, and Mock implementations have uniform signatures.
 */
class AIProviderInterface {
  /**
   * Generates structured text/JSON from prompts.
   * @param {Object} options
   * @param {string} options.systemPrompt - Role and guardrails
   * @param {string} options.userPrompt - Task input
   * @param {Object} [options.responseSchema] - Optional JSON schema for validation
   * @returns {Promise<string>} Raw output text (expected JSON string)
   */
  async generateCompletion(options) {
    throw new Error('generateCompletion() must be implemented by the provider.');
  }

  /**
   * Provider identifier name.
   * @returns {string}
   */
  getName() {
    throw new Error('getName() must be implemented.');
  }
}

module.exports = AIProviderInterface;
