import mongoose from 'mongoose';

const executionResultSchema = new mongoose.Schema(
  {
    testCaseNumber: {
      type: Number,
      required: true,
    },
    isSample: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Passed', 'Failed', 'Error', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Compilation Error', 'Runtime Error'],
      required: true,
    },
    actualOutput: {
      type: String,
      default: '',
    },
    expectedOutput: {
      type: String,
      default: '',
      // Protected field - not included in default selection to protect hidden test cases
      select: false,
    },
    executionTime: {
      type: Number, // Execution time in milliseconds
      default: 0,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    battle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Battle',
      required: [true, 'Battle reference is required'],
      index: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: [true, 'Problem reference is required'],
      index: true,
    },
    sourceCode: {
      type: String,
      required: [true, 'Source code is required'],
    },
    language: {
      type: String,
      required: [true, 'Programming language is required'],
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: [
          'Pending',
          'Running',
          'Accepted',
          'Wrong Answer',
          'Compilation Error',
          'Runtime Error',
          'Time Limit Exceeded',
          'Failed',
        ],
        message: '{VALUE} is not a valid submission status',
      },
      default: 'Pending',
      index: true,
    },
    executionResults: {
      type: [executionResultSchema],
      default: [],
    },
    passedTestCases: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalTestCases: {
      type: Number,
      default: 0,
      min: 0,
    },
    executionTime: {
      type: Number, // in milliseconds
      default: 0,
      min: 0,
    },
    memoryUsed: {
      type: Number, // in KB
      default: 0,
      min: 0,
    },
    codingScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      index: true,
    },
    isBestSubmission: {
      type: Boolean,
      default: false,
      index: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound indexes for fetching battle submissions and ranking
submissionSchema.index({ battle: 1, user: 1, submittedAt: -1 });
submissionSchema.index({ battle: 1, user: 1, isBestSubmission: 1 });
submissionSchema.index({ user: 1, codingScore: -1 });

// Instance method to scrub hidden test case details for public participant response
submissionSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  if (Array.isArray(obj.executionResults)) {
    obj.executionResults = obj.executionResults.map((res) => {
      // If it's a hidden testcase, do not expose internal expected output
      if (!res.isSample) {
        return {
          testCaseNumber: res.testCaseNumber,
          isSample: false,
          status: res.status,
          executionTime: res.executionTime,
          errorMessage: res.errorMessage ? 'Execution Error' : null,
          // Hide actual and expected outputs for hidden test cases
        };
      }
      return res;
    });
  }
  return obj;
};

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
