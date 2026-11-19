import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Do not return password by default in queries
    },
    profileImage: {
      type: String,
      default: function () {
        return `https://api.dicebear.com/7.x/bottts/svg?seed=${this.username || 'default'}`;
      },
    },
    college: {
      type: String,
      trim: true,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    codingStats: {
      totalBattles: {
        type: Number,
        default: 0,
        min: [0, 'Total battles cannot be negative'],
      },
      wins: {
        type: Number,
        default: 0,
        min: [0, 'Wins cannot be negative'],
      },
      losses: {
        type: Number,
        default: 0,
        min: [0, 'Losses cannot be negative'],
      },
      totalCodingScore: {
        type: Number,
        default: 0,
        min: [0, 'Total coding score cannot be negative'],
      },
      totalInterviewScore: {
        type: Number,
        default: 0,
        min: [0, 'Total interview score cannot be negative'],
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound indexes for leaderboard and profile analytics
userSchema.index({ 'codingStats.wins': -1, 'codingStats.totalBattles': -1 });
userSchema.index({ 'codingStats.totalCodingScore': -1, 'codingStats.totalInterviewScore': -1 });

// Pre-save hook: Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare candidate password with stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  // If password was not selected in query, throw explicit error
  if (!this.password) {
    throw new Error('Password hash not selected in query. Use .select("+password")');
  }
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
