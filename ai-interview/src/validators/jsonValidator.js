/**
 * Safe JSON parser and schema validator for LLM output.
 */
class JsonValidator {
  /**
   * Cleans and parses raw AI output string into a JavaScript object.
   * Handles markdown codeblocks, stray backticks, and whitespace.
   * @param {string} rawText
   * @returns {Object}
   */
  static parse(rawText) {
    if (!rawText || typeof rawText !== 'string') {
      throw new Error('AI output is empty or not a string.');
    }

    let cleaned = rawText.trim();

    // Strip markdown code fences like ```json ... ``` or ``` ... ```
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
      cleaned = cleaned.replace(/\s*```$/, '');
    }

    cleaned = cleaned.trim();

    try {
      return JSON.parse(cleaned);
    } catch (err) {
      throw new Error(`Failed to parse AI response as valid JSON: ${err.message}. Raw text: ${cleaned.substring(0, 150)}...`);
    }
  }

  /**
   * Validates parsed object against required fields and types.
   * @param {Object} data
   * @param {Object} schema
   */
  static validate(data, schema) {
    if (!data || typeof data !== 'object') {
      throw new Error('Parsed data must be an object.');
    }

    if (schema.required && Array.isArray(schema.required)) {
      for (const field of schema.required) {
        if (data[field] === undefined || data[field] === null) {
          throw new Error(`Schema validation error: Missing required property "${field}".`);
        }
      }
    }

    if (schema.properties) {
      for (const [key, propConfig] of Object.entries(schema.properties)) {
        if (data[key] !== undefined && data[key] !== null) {
          if (propConfig.type === 'array' && !Array.isArray(data[key])) {
            throw new Error(`Schema validation error: Field "${key}" must be an array.`);
          }
          if (propConfig.type === 'object' && (typeof data[key] !== 'object' || Array.isArray(data[key]))) {
            throw new Error(`Schema validation error: Field "${key}" must be an object.`);
          }
          if (propConfig.type === 'string' && typeof data[key] !== 'string') {
            throw new Error(`Schema validation error: Field "${key}" must be a string.`);
          }
          if (propConfig.type === 'number' && typeof data[key] !== 'number') {
            throw new Error(`Schema validation error: Field "${key}" must be a number.`);
          }
          if (propConfig.type === 'boolean' && typeof data[key] !== 'boolean') {
            throw new Error(`Schema validation error: Field "${key}" must be a boolean.`);
          }
        }
      }
    }

    return true;
  }
}

module.exports = JsonValidator;
