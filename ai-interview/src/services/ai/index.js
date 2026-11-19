const config = require('../../config');
const MockProvider = require('./mockProvider');
const GeminiProvider = require('./geminiProvider');

function createAIProvider(providerName = config.aiProvider) {
  const selected = (providerName || 'mock').toLowerCase();

  switch (selected) {
    case 'gemini':
      return new GeminiProvider(config.gemini.apiKey, config.gemini.model);
    case 'mock':
    default:
      return new MockProvider();
  }
}

module.exports = {
  createAIProvider,
  MockProvider,
  GeminiProvider,
};
