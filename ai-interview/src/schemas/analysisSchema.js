/**
 * JSON Schema definition and specification for Feature A: Code Analysis.
 */
const analysisSchema = {
  type: 'object',
  properties: {
    algorithm: { type: 'string' },
    approach: { type: 'string' },
    dataStructures: {
      type: 'array',
      items: { type: 'string' },
    },
    timeComplexity: {
      type: 'object',
      properties: {
        value: { type: 'string' },
        explanation: { type: 'string' },
      },
      required: ['value', 'explanation'],
    },
    spaceComplexity: {
      type: 'object',
      properties: {
        value: { type: 'string' },
        explanation: { type: 'string' },
      },
      required: ['value', 'explanation'],
    },
    potentialBugs: {
      type: 'array',
      items: { type: 'string' },
    },
    edgeCases: {
      type: 'array',
      items: { type: 'string' },
    },
    inefficientOperations: {
      type: 'array',
      items: { type: 'string' },
    },
    possibleImprovements: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: [
    'algorithm',
    'approach',
    'dataStructures',
    'timeComplexity',
    'spaceComplexity',
    'potentialBugs',
    'edgeCases',
    'inefficientOperations',
    'possibleImprovements',
  ],
};

module.exports = analysisSchema;
