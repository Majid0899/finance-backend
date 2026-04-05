import mongoose from 'mongoose'

const RECORD_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

const CATEGORIES = [
  'salary',
  'investment',
  'freelance',
  'operations',
  'marketing',
  'utilities',
  'rent',
  'travel',
  'food',
  'healthcare',
  'education',
  'entertainment',
  'other',
];

const financialRecordSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      enum: Object.values(RECORD_TYPES),
      required: [true, 'Type is required (income or expense)'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      lowercase: true,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Soft delete fields
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
financialRecordSchema.index({ type: 1, category: 1, date: -1 });
financialRecordSchema.index({ isDeleted: 1, date: -1 });
financialRecordSchema.index({ createdBy: 1, isDeleted: 1 });

// Global query filter — always exclude soft-deleted records by default
financialRecordSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

financialRecordSchema.statics.RECORD_TYPES = RECORD_TYPES;
financialRecordSchema.statics.CATEGORIES = CATEGORIES;

const FinancialRecord = mongoose.model('FinancialRecord', financialRecordSchema);

export {FinancialRecord}