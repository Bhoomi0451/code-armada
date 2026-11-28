const questionSchema = require('../schemas/questionSchema');

/**
 * Builds system and user prompts for Feature B: Personalized Question Generation.
 */
function buildQuestionPrompt({ problemStatement, language, sourceCode, analysis }) {
  const systemPrompt = `You are a senior technical interviewer on Code Armada.
Your role is to interview a candidate on their actual submitted DSA solution.

CORE GUIDELINES:
1. PERSONALIZED & SPECIFIC: Every question MUST be specific to the candidate's actual implementation (referencing their specific variable names, loops, chosen data structures, or logic). Avoid generic textbook questions.
2. 5 REQUIRED CATEGORIES: You must generate exactly 5 questions, one for each category:
   - "algorithm_understanding": Probe why this algorithm was chosen, its core invariants, or how the search/computation space is traversed.
   - "time_complexity": Ask for the best, worst, or average time complexity specifically pointing to their loops/recursions.
   - "space_complexity": Ask about auxiliary memory allocations and pointer/variable overhead in their code.
   - "edge_cases": Ask how their specific code behaves on boundary inputs (e.g. empty inputs, duplicates, extreme values, negative numbers).
   - "optimization_tradeoffs": Ask how their solution could be optimized further, or how alternative data structures/approaches compare in trade-offs.
3. CONCISE & CLEAR: Each question should be direct, professional, and targeted.
4. STRICT JSON: Respond ONLY with valid JSON conforming to the schema. Do not add markdown backticks or commentary.`;

  const userPrompt = `Generate 5 personalized technical interview questions based on the candidate's code and analysis.

[PROBLEM STATEMENT]
${problemStatement}

[LANGUAGE]
${language}

[SUBMITTED SOURCE CODE]
\`\`\`${language}
${sourceCode}
\`\`\`

[STATIC ANALYSIS SUMMARY]
- Algorithm: ${analysis.algorithm}
- Approach: ${analysis.approach}
- Data Structures: ${(analysis.dataStructures || []).join(', ')}
- Time Complexity: ${analysis.timeComplexity?.value || 'N/A'} (${analysis.timeComplexity?.explanation || ''})
- Space Complexity: ${analysis.spaceComplexity?.value || 'N/A'} (${analysis.spaceComplexity?.explanation || ''})
- Edge Cases: ${(analysis.edgeCases || []).join('; ')}
- Improvements: ${(analysis.possibleImprovements || []).join('; ')}

REQUIRED JSON OUTPUT FORMAT:
{
  "questions": [
    {
      "questionId": "q1",
      "category": "algorithm_understanding",
      "question": "<Tailored question referencing their code>",
      "difficulty": "easy | medium | hard",
      "expectedConcepts": ["<concept1>", "<concept2>"]
    },
    {
      "questionId": "q2",
      "category": "time_complexity",
      "question": "<Tailored question on their loops/recursion>",
      "difficulty": "easy | medium | hard",
      "expectedConcepts": ["<concept1>", "<concept2>"]
    },
    {
      "questionId": "q3",
      "category": "space_complexity",
      "question": "<Tailored question on memory allocation>",
      "difficulty": "easy | medium | hard",
      "expectedConcepts": ["<concept1>", "<concept2>"]
    },
    {
      "questionId": "q4",
      "category": "edge_cases",
      "question": "<Tailored question on specific unhandled or handled edge case>",
      "difficulty": "easy | medium | hard",
      "expectedConcepts": ["<concept1>", "<concept2>"]
    },
    {
      "questionId": "q5",
      "category": "optimization_tradeoffs",
      "question": "<Tailored question on alternative approach or trade-off>",
      "difficulty": "easy | medium | hard",
      "expectedConcepts": ["<concept1>", "<concept2>"]
    }
  ]
}`;

  return {
    systemPrompt,
    userPrompt,
    schema: questionSchema,
  };
}

module.exports = buildQuestionPrompt;
