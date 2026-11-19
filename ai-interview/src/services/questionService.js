const config = require('../config');
const JsonValidator = require('../validators/jsonValidator');
const buildQuestionPrompt = require('../prompts/questionPrompt');
const { createAIProvider } = require('./ai');

const CATEGORY_MARKS = {
  algorithm_understanding: config.rubric.algorithmUnderstanding, // 25
  time_complexity: config.rubric.timeComplexity,                 // 20
  space_complexity: config.rubric.spaceComplexity,               // 15
  edge_cases: config.rubric.edgeCases,                           // 20
  optimization_tradeoffs: config.rubric.optimizationTradeoffs,   // 20
};

/**
 * Service responsible for Feature B: Generating personalized interview questions.
 */
class QuestionService {
  constructor(aiProvider = null) {
    this.aiProvider = aiProvider || createAIProvider();
  }

  /**
   * Generates 5 personalized questions matching the rubric categories.
   * @param {Object} params
   * @param {string} params.problemStatement
   * @param {string} params.language
   * @param {string} params.sourceCode
   * @param {Object} params.analysis
   * @returns {Promise<Array<Object>>} List of 5 validated questions with assigned marks
   */
  async generateQuestions({ problemStatement, language, sourceCode, analysis }) {
    if (!problemStatement || !language || !sourceCode || !analysis) {
      throw new Error('Problem statement, language, source code, and analysis are required to generate questions.');
    }

    const { systemPrompt, userPrompt, schema } = buildQuestionPrompt({
      problemStatement,
      language,
      sourceCode,
      analysis,
    });

    const completionText = await this.aiProvider.generateCompletion({
      systemPrompt,
      userPrompt,
      responseSchema: schema,
    });

    const parsedData = JsonValidator.parse(completionText);
    JsonValidator.validate(parsedData, schema);

    if (!Array.isArray(parsedData.questions) || parsedData.questions.length === 0) {
      throw new Error('AI response did not contain an array of questions.');
    }

    // Attach rubric marks and index tracking to each question
    const questionsWithMarks = parsedData.questions.map((q, idx) => {
      const maxMarks = CATEGORY_MARKS[q.category] || 20;
      return {
        questionId: q.questionId || `q${idx + 1}`,
        category: q.category,
        maxScore: maxMarks,
        question: q.question,
        difficulty: q.difficulty || 'medium',
        expectedConcepts: Array.isArray(q.expectedConcepts) ? q.expectedConcepts : [],
      };
    });

    return questionsWithMarks;
  }
}

module.exports = QuestionService;
