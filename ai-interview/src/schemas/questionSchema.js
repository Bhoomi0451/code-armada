/**
 * JSON Schema definition for Feature B: Personalized Interview Questions.
 */
const questionSchema = {
  type: 'object',
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          questionId: { type: 'string' },
          category: {
            type: 'string',
            enum: [
              'algorithm_understanding',
              'time_complexity',
              'space_complexity',
              'edge_cases',
              'optimization_tradeoffs',
            ],
          },
          question: { type: 'string' },
          difficulty: {
            type: 'string',
            enum: ['easy', 'medium', 'hard'],
          },
          expectedConcepts: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['questionId', 'category', 'question', 'difficulty', 'expectedConcepts'],
      },
    },
  },
  required: ['questions'],
};

module.exports = questionSchema;
