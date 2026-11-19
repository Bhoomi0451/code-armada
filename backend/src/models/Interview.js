import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    questionType: {
      type: String,
      enum: {
        values: [
          'Complexity',
          'EdgeCase',
          'Optimization',
          'AlgorithmExplanation',
          'ImplementationChoice',
        ],
        message: '{VALUE} is not a supported question type',
      },
      default: 'AlgorithmExplanation',
    },
    relatedCodeSection: {
      type: String,
      default: '', // Snippet of participant code related to this question
    },
    expectedConcepts: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    maximumMarks: {
      type: Number,
      default: 10,
      min: [1, 'Maximum marks must be at least 1'],
    },
  },
  { _id: true }
);

const participantResponseSchema = new mongoose.Schema(
  {
    questionIndex: {
      type: Number,
      required: [true, 'Question index reference is required'],
    },
    questionText: {
      type: String,
      default: '',
    },
    answer: {
      type: String,
      required: [true, 'Participant answer is required'],
      trim: true,
    },
    awardedMarks: {
      type: Number,
      default: 0,
      min: 0,
    },
    feedback: {
      type: String,
      default: '',
    },
    evaluatedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: true }
);

const interviewSchema = new mongoose.Schema(
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
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: [true, 'Submission reference is required'],
    },
    questions: {
      type: [questionSchema],
      default: [],
      validate: {
        validator: function (v) {
          return Array.isArray(v);
        },
        message: 'Questions must be an array',
      },
    },
    participantResponses: {
      type: [participantResponseSchema],
      default: [],
    },
    evaluationStatus: {
      type: String,
      enum: {
        values: ['Pending', 'In Progress', 'Completed'],
        message: 'Status must be Pending, In Progress, or Completed',
      },
      default: 'Pending',
      index: true,
    },
    totalInterviewScore: {
      type: Number,
      default: 0,
      min: 0,
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

// Compound unique index ensuring only one interview document per user per battle
interviewSchema.index({ user: 1, battle: 1 }, { unique: true });
interviewSchema.index({ battle: 1, evaluationStatus: 1 });

// Helper instance method to compute and update totalInterviewScore
interviewSchema.methods.calculateTotalScore = function () {
  this.totalInterviewScore = this.participantResponses.reduce(
    (acc, cur) => acc + (cur.awardedMarks || 0),
    0
  );
  return this.totalInterviewScore;
};

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
