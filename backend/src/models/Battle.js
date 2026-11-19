import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Participant user reference is required'],
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    isReady: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const scoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    codingScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    interviewScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const battleSchema = new mongoose.Schema(
  {
    battleId: {
      type: String,
      required: [true, 'Battle ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    participants: {
      type: [participantSchema],
      default: [],
      validate: {
        validator: function (v) {
          // A battle can have at most 2 participants in 1v1
          return v.length <= 2;
        },
        message: 'A 1v1 battle can have at most 2 participants',
      },
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: [true, 'Problem reference is required'],
      index: true,
    },
    startTime: {
      type: Date,
      default: null,
    },
    endTime: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number,
      default: 1800, // 30 minutes in seconds
      min: [60, 'Battle duration must be at least 60 seconds'],
    },
    status: {
      type: String,
      enum: {
        values: ['Waiting', 'Active', 'Completed', 'Cancelled'],
        message: 'Status must be Waiting, Active, Completed, or Cancelled',
      },
      default: 'Waiting',
      index: true,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    participantScores: {
      type: [scoreSchema],
      default: [],
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

// Compound indexes for user query and battle status monitoring
battleSchema.index({ status: 1, createdAt: -1 });
battleSchema.index({ 'participants.user': 1, status: 1 });

// Validate valid status transitions before saving
battleSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    // If transitioning to Active, verify 2 participants exist
    if (this.status === 'Active') {
      if (!this.participants || this.participants.length !== 2) {
        return next(
          new Error('A battle must have exactly two participants before becoming Active')
        );
      }
      if (!this.startTime) {
        this.startTime = new Date();
      }
    }

    // If transitioning to Completed or Cancelled, record endTime
    if (this.status === 'Completed' || this.status === 'Cancelled') {
      if (!this.endTime) {
        this.endTime = new Date();
      }
    }
  }
  next();
});

// Helper instance method to check if user is in this battle
battleSchema.methods.hasParticipant = function (userId) {
  const targetId = userId.toString();
  return this.participants.some(
    (p) => (p.user._id ? p.user._id.toString() : p.user.toString()) === targetId
  );
};

const Battle = mongoose.model('Battle', battleSchema);
export default Battle;
