import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String, default: '' },
  },
  { _id: false }
);

const starterCodeSchema = new mongoose.Schema(
  {
    language: { type: String, required: true, lowercase: true },
    code: { type: String, required: true },
  },
  { _id: false }
);

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: [true, 'Test case input is required'],
  },
  expectedOutput: {
    type: String,
    required: [true, 'Expected output is required'],
  },
  isSample: {
    type: Boolean,
    default: false,
    index: true,
  },
  marks: {
    type: Number,
    default: 10,
    min: [1, 'Marks per testcase must be at least 1'],
  },
});

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      unique: true,
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Problem description is required'],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: 'Difficulty must be Easy, Medium, or Hard',
      },
      index: true,
    },
    topics: {
      type: [String],
      required: [true, 'At least one topic tag is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one topic must be specified',
      },
      index: true,
    },
    constraints: {
      type: [String],
      required: [true, 'Constraints are required'],
      default: [],
    },
    inputFormat: {
      type: String,
      required: [true, 'Input format description is required'],
    },
    outputFormat: {
      type: String,
      required: [true, 'Output format description is required'],
    },
    examples: {
      type: [exampleSchema],
      default: [],
    },
    starterCode: {
      type: [starterCodeSchema],
      default: [],
    },
    supportedLanguages: {
      type: [String],
      default: ['javascript', 'python', 'cpp', 'java'],
    },
    testCases: {
      type: [testCaseSchema],
      required: [true, 'Test cases are required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one testcase must be provided',
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Auto-generate slug before validation if not provided
problemSchema.pre('validate', function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Instance method to get public-safe representation (hiding secret/hidden test cases)
problemSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  // Retain ONLY sample test cases for public participants
  if (Array.isArray(obj.testCases)) {
    obj.testCases = obj.testCases
      .filter((tc) => tc.isSample === true)
      .map((tc) => ({
        _id: tc._id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isSample: true,
        marks: tc.marks,
      }));
  }
  return obj;
};

// Text index for keyword search on title, description, and topics
problemSchema.index({ title: 'text', description: 'text', topics: 'text' });
problemSchema.index({ difficulty: 1, isActive: 1 });

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
