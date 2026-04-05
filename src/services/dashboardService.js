import { FinancialRecord } from "../models/FinancialRecord.js";

// ─── Summary Overview ──────────────────────────────────────────────
export const getSummary = async () => {
  const result = await FinancialRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  const income = result.find((r) => r._id === 'income') || { total: 0, count: 0 };
  const expense = result.find((r) => r._id === 'expense') || { total: 0, count: 0 };

  return {
    totalIncome: income.total,
    totalExpenses: expense.total,
    netBalance: income.total - expense.total,
    totalIncomeTransactions: income.count,
    totalExpenseTransactions: expense.count,
    totalTransactions: income.count + expense.count,
  };
};

// ─── Category-wise Totals ──────────────────────────────────────────
export const getCategoryTotals = async (type) => {
  const match = { isDeleted: false };
  if (type) match.type = type;

  const result = await FinancialRecord.aggregate([
    { $match: match },
    {
      $group: {
        _id: { category: '$category', type: '$type' },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);

  // Structure: { income: [...], expense: [...] }
  const grouped = { income: [], expense: [] };
  result.forEach(({ _id, total, count }) => {
    if (grouped[_id.type]) {
      grouped[_id.type].push({ category: _id.category, total, count });
    }
  });

  return grouped;
};

// ─── Monthly Trends ────────────────────────────────────────────────
export const getMonthlyTrends = async (year) => {
  const targetYear = year ? parseInt(year) : new Date().getFullYear();
  const startDate = new Date(`${targetYear}-01-01`);
  const endDate = new Date(`${targetYear}-12-31T23:59:59`);

  const result = await FinancialRecord.aggregate([
    {
      $match: {
        isDeleted: false,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$date' }, type: '$type' },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.month': 1 } },
  ]);

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    monthName: new Date(targetYear, i, 1).toLocaleString('default', { month: 'long' }),
    income: 0,
    expense: 0,
    net: 0,
  }));

  result.forEach(({ _id, total }) => {
    const monthData = months[_id.month - 1];
    if (_id.type === 'income') monthData.income = total;
    else monthData.expense = total;
    monthData.net = monthData.income - monthData.expense;
  });

  return { year: targetYear, months };
};

// ─── Weekly Trends (last 8 weeks) ─────────────────────────────────
export const getWeeklyTrends = async () => {
  const eightWeeksAgo = new Date();
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

  const result = await FinancialRecord.aggregate([
    {
      $match: {
        isDeleted: false,
        date: { $gte: eightWeeksAgo },
      },
    },
    {
      $group: {
        _id: {
          week: { $isoWeek: '$date' },
          year: { $isoWeekYear: '$date' },
          type: '$type',
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.week': 1 } },
  ]);

  // Merge income/expense for same week
  const weekMap = {};
  result.forEach(({ _id, total, count }) => {
    const key = `${_id.year}-W${_id.week}`;
    if (!weekMap[key]) {
      weekMap[key] = { week: _id.week, year: _id.year, label: key, income: 0, expense: 0, net: 0 };
    }
    weekMap[key][_id.type] = total;
    weekMap[key].net = weekMap[key].income - weekMap[key].expense;
  });

  return Object.values(weekMap);
};

// ─── Recent Activity ───────────────────────────────────────────────
export const getRecentActivity = async (limit = 10) => {
  const records = await FinancialRecord.find()
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  return records;
};

// ─── Full Dashboard (combined) ─────────────────────────────────────
export const getDashboardOverview = async (year) => {
  const [summary, categoryTotals, monthlyTrends, recentActivity] = await Promise.all([
    getSummary(),
    getCategoryTotals(),
    getMonthlyTrends(year),
    getRecentActivity(5),
  ]);

  return { summary, categoryTotals, monthlyTrends, recentActivity };
};

