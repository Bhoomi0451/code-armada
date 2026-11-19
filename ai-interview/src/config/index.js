require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  aiProvider: (process.env.AI_PROVIDER || 'mock').toLowerCase(),

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  },

  grok: {
    apiKey: process.env.GROK_API_KEY || '',
    model: process.env.GROK_MODEL || 'grok-beta',
    apiUrl: 'https://api.x.ai/v1/chat/completions',
  },

  limits: {
    maxCodeLength: parseInt(process.env.MAX_CODE_LENGTH || '10000', 10),
    maxAnswerLength: parseInt(process.env.MAX_ANSWER_LENGTH || '2000', 10),
    maxFollowUpsPerQuestion: parseInt(process.env.MAX_FOLLOW_UPS_PER_QUESTION || '1', 10),
    requestTimeoutMs: 30000,
  },

  rubric: {
    algorithmUnderstanding: 25,
    timeComplexity: 20,
    spaceComplexity: 15,
    edgeCases: 20,
    optimizationTradeoffs: 20,
    totalMarks: 100,
  },
};

function validateConfig() {
  if (config.aiProvider === 'gemini' && !config.gemini.apiKey) {
    if (config.nodeEnv !== 'test') {
      console.warn('[Config Warning] GEMINI_API_KEY is not set. Falling back to mock provider for safety.');
      config.aiProvider = 'mock';
    }
  }

  if (config.aiProvider === 'grok' && !config.grok.apiKey) {
    if (config.nodeEnv !== 'test') {
      console.warn('[Config Warning] GROK_API_KEY is not set. Falling back to mock provider for safety.');
      config.aiProvider = 'mock';
    }
  }
}

validateConfig();

module.exports = config;
