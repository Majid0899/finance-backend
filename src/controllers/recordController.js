import * as recordService from '../services/recordService.js'

const getAllRecords = async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder, type, category, startDate, endDate, search } = req.query;
    const result = await recordService.getAllRecords(
      { type, category, startDate, endDate, search },
      { page, limit, sortBy, sortOrder }
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

const getRecordById = async (req, res) => {
  try {
    const record = await recordService.getRecordById(req.params.id);
    res.status(200).json({ success: true, data: { record } });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

const createRecord = async (req, res) => {
  try {
    const record = await recordService.createRecord(req.body, req.user._id);
    res.status(201).json({
      success: true,
      message: 'Record created successfully.',
      data: { record },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

const updateRecord = async (req, res) => {
  try {
    const record = await recordService.updateRecord(req.params.id, req.body, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Record updated successfully.',
      data: { record },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

const deleteRecord = async (req, res) => {
  try {
    await recordService.softDeleteRecord(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: 'Record deleted successfully.' });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

const hardDeleteRecord = async (req, res) => {
  try {
    await recordService.hardDeleteRecord(req.params.id);
    res.status(200).json({ success: true, message: 'Record permanently deleted.' });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

const getDeletedRecords = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await recordService.getDeletedRecords({ page, limit });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

const restoreRecord = async (req, res) => {
  try {
    const record = await recordService.restoreRecord(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Record restored successfully.',
      data: { record },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

export {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  hardDeleteRecord,
  getDeletedRecords,
  restoreRecord,
}
