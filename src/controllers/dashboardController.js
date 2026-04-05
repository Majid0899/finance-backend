import * as dashboardService from '../services/dashboardService.js'

const getOverview = async (req, res) => {
  try {
    const { year } = req.query;
    const data = await dashboardService.getDashboardOverview(year);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

const getSummary = async (req, res) => {
  try {
    const data = await dashboardService.getSummary();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

const getCategoryTotals = async (req, res) => {
  try {
    const { type } = req.query;
    const data = await dashboardService.getCategoryTotals(type);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

const getMonthlyTrends = async (req, res) => {
  try {
    const { year } = req.query;
    const data = await dashboardService.getMonthlyTrends(year);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

const getWeeklyTrends = async (req, res) => {
  try {
    const data = await dashboardService.getWeeklyTrends();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const { limit } = req.query;
    const data = await dashboardService.getRecentActivity(limit);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong.',
    });
  }
};

export {
  getOverview,
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getWeeklyTrends,
  getRecentActivity,
}

