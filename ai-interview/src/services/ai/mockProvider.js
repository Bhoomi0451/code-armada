const AIProviderInterface = require('./providerInterface');

class MockProvider extends AIProviderInterface {
  constructor(customResponses = {}) {
    super();
    this.customResponses = customResponses;
  }

  getName() {
    return 'mock';
  }

  async generateCompletion({ systemPrompt, userPrompt }) {
    // Check if a custom mock handler or response exists
    if (this.customResponses.nextResponse) {
      const res = this.customResponses.nextResponse;
      this.customResponses.nextResponse = null;
      return typeof res === 'string' ? res : JSON.stringify(res);
    }

    // Default mock response when testing analysis
    if (userPrompt && userPrompt.includes('Analyze the following DSA solution')) {
      return JSON.stringify({
        algorithm: 'Binary Search',
        approach: 'Divide and conquer on sorted array space',
        dataStructures: ['Array'],
        timeComplexity: { value: 'O(log n)', explanation: 'Halves the search space each iteration' },
        spaceComplexity: { value: 'O(1)', explanation: 'Operates with two pointers in place' },
        potentialBugs: [],
        edgeCases: ['Target not present', 'Single element array', 'Empty array'],
        inefficientOperations: [],
        possibleImprovements: ['Avoid potential integer overflow in mid calculation using left + (right - left) / 2']
      });
    }

    // Default mock response for question generation
    if (userPrompt && userPrompt.includes('Generate 5 personalized technical interview questions')) {
      return JSON.stringify({
        questions: [
          {
            questionId: 'q1',
            category: 'algorithm_understanding',
            question: 'Why did you choose binary search instead of linear search for this problem?',
            difficulty: 'easy',
            expectedConcepts: ['search space reduction', 'time efficiency']
          },
          {
            questionId: 'q2',
            category: 'time_complexity',
            question: 'What is the time complexity of your approach in the worst case and why?',
            difficulty: 'medium',
            expectedConcepts: ['logarithmic reduction', 'worst case scenario']
          },
          {
            questionId: 'q3',
            category: 'space_complexity',
            question: 'What is the auxiliary space complexity of your implementation?',
            difficulty: 'easy',
            expectedConcepts: ['O(1) pointers', 'in-place execution']
          },
          {
            questionId: 'q4',
            category: 'edge_cases',
            question: 'How does your solution handle an empty array or an array with duplicates?',
            difficulty: 'medium',
            expectedConcepts: ['bounds checking', 'duplicate handling']
          },
          {
            questionId: 'q5',
            category: 'optimization_tradeoffs',
            question: 'How would your algorithm change if the input was a linked list rather than an indexed array?',
            difficulty: 'hard',
            expectedConcepts: ['random access requirement', 'trade-offs with pointer jumping']
          }
        ]
      });
    }

    // Default mock response for answer evaluation
    if (userPrompt && userPrompt.includes('Evaluate the candidate')) {
      return JSON.stringify({
        score: 22,
        maxScore: 25,
        status: 'correct',
        feedback: 'Solid explanation demonstrating clear understanding of binary search mechanics.',
        strengths: ['Accurately explained logarithmic division of search space'],
        missingConcepts: ['Did not mention edge cases with large indices'],
        mistakes: [],
        improvementSuggestions: ['Reference potential overflow when calculating mid index'],
        followUpRequired: false,
        followUpQuestion: null
      });
    }

    return JSON.stringify({ message: 'Mock response generated successfully.' });
  }
}

module.exports = MockProvider;
