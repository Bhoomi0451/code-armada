import mongoose from 'mongoose';

const aiPerformanceReportSchema = new mongoose.Schema(
  {
    summary: {
      type: String,
      default: '',
    },
    codeEfficiencyReview: {
      type: String,
      default: '',
    },
    interviewDepthReview: {
      type: String,
      default: '',
    },
    recommendedPracticeTopics: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    battle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Battle',
      required: [true, 'Battle reference is required'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: [true, 'Submission reference is required'],
    },
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      default: null,
    },
    codingScore: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    interviewScore: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    accuracy: {
      type: Number, // Percentage of test cases passed (0-100)
      default: 0,
      min: 0,
      max: 100,
    },
    executionTime: {
      type: Number, // In milliseconds
      default: 0,
    },
    rank: {
      type: Number, // 1 for winner, 2 for runner-up
      default: 1,
      enum: [1, 2],
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    improvementSuggestions: {
      type: [String],
      default: [],
    },
    aiPerformanceReport: {
      type: aiPerformanceReportSchema,
      default: () => ({}),
    },
    completedAt: {
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

// Compound unique index ensuring only one Result document exists per user per battle
resultSchema.index({ battle: 1, user: 1 }, { unique: true });
resultSchema.index({ user: 1, completedAt: -1 });
resultSchema.index({ totalScore: -1, accuracy: -1 });

// Automatically compute totalScore before saving
resultSchema.pre('save', function (next) {
  this.totalScore = (this.codingScore || 0) + (this.interviewScore || 0);
  next();
});

const Result = mongoose.model('Result', resultSchema);
export default Result;
