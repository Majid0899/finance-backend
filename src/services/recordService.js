import { FinancialRecord } from '../models/FinancialRecord.js';

// Build a MongoDB filter object from query parameters
const buildFilterQuery = ({ type, category, startDate, endDate, search }) => {
  const query = {};

  if (type) query.type = type;
  if (category) query.category = category.toLowerCase();

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate)   query.date.$lte = new Date(endDate);
  }

  if (search) {
    query.$or = [
      { title:    { $regex: search, $options: 'i' } },
      { notes:    { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  return query;
};

export const getAllRecords = async (filters, { page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc' }) => {
  const query = buildFilterQuery(filters);
  const skip  = (page - 1) * limit;
  const sort  = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const total   = await FinancialRecord.countDocuments(query);
  const records = await FinancialRecord.find(query)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  return {
    records,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};

export const getRecordById = async (id) => {
  const record = await FinancialRecord.findById(id)
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  if (!record) {
    const err = new Error('Financial record not found.');
    err.statusCode = 404;
    throw err;
  }

  return record;
};

export const createRecord = async (data, userId) => {
  const record = await FinancialRecord.create({ ...data, createdBy: userId });
  return record.populate('createdBy', 'name email');
};

export const updateRecord = async (id, data, userId) => {
  const record = await FinancialRecord.findById(id);
  if (!record) {
    const err = new Error('Financial record not found.');
    err.statusCode = 404;
    throw err;
  }

  const updated = await FinancialRecord.findByIdAndUpdate(
    id,
    { ...data, updatedBy: userId },
    { new: true, runValidators: true }
  )
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  return updated;
};

// Soft delete — marks record as deleted but keeps it in the database
export const softDeleteRecord = async (id, userId) => {
  const record = await FinancialRecord.findById(id);
  if (!record) {
    const err = new Error('Financial record not found.');
    err.statusCode = 404;
    throw err;
  }

  record.isDeleted  = true;
  record.deletedAt  = new Date();
  record.deletedBy  = userId;
  await record.save();
};

// Hard delete — permanently removes the record from the database (admin only)
export const hardDeleteRecord = async (id) => {
  const record = await FinancialRecord.findByIdAndDelete(id).setOptions({ includeDeleted: true });
  if (!record) {
    const err = new Error('Financial record not found.');
    err.statusCode = 404;
    throw err;
  }
};

// Get all soft-deleted records (admin only)
export const getDeletedRecords = async ({ page = 1, limit = 10 }) => {
  const query = { isDeleted: true };
  const skip  = (page - 1) * limit;
  const total = await FinancialRecord.countDocuments(query).setOptions({ includeDeleted: true });

  const records = await FinancialRecord.find(query)
    .setOptions({ includeDeleted: true })
    .populate('createdBy', 'name email')
    .populate('deletedBy', 'name email')
    .sort({ deletedAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    records,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};

// Restore a soft-deleted record
export const restoreRecord = async (id) => {
  const record = await FinancialRecord.findById(id).setOptions({ includeDeleted: true });

  if (!record) {
    const err = new Error('Financial record not found.');
    err.statusCode = 404;
    throw err;
  }

  if (!record.isDeleted) {
    const err = new Error('Record is not deleted.');
    err.statusCode = 400;
    throw err;
  }

  record.isDeleted = false;
  record.deletedAt = null;
  record.deletedBy = null;
  await record.save();

  return record;
};

