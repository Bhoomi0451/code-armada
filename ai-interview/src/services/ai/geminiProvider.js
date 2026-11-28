const AIProviderInterface = require('./providerInterface');

class GeminiProvider extends AIProviderInterface {
  constructor(apiKey, modelName = 'gemini-2.5-flash') {
    super();
    if (!apiKey) {
      throw new Error('Gemini API key is required to initialize GeminiProvider.');
    }
    this.apiKey = apiKey;
    this.modelName = modelName;
    this.aiInstance = null;
  }

  getName() {
    return 'gemini';
  }

  async _getClient() {
    if (!this.aiInstance) {
      const { GoogleGenAI } = await import('@google/genai');
      this.aiInstance = new GoogleGenAI({ apiKey: this.apiKey });
    }
    return this.aiInstance;
  }

  async generateCompletion({ systemPrompt, userPrompt, responseSchema }) {
    const ai = await this._getClient();

    const config = {
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
    };

    if (responseSchema) {
      config.responseSchema = responseSchema;
    }

    const response = await ai.models.generateContent({
      model: this.modelName,
      contents: userPrompt,
      config,
    });

    if (!response || !response.text) {
      throw new Error('Gemini API returned an empty or invalid response.');
    }

    return response.text;
  }
}

module.exports = GeminiProvider;
