import express from 'express';
import { getOverview,getSummary,getCategoryTotals,getMonthlyTrends,getWeeklyTrends,getRecentActivity } from '../controllers/dashboardController.js';
import { authenticate,authorize } from '../middlewares/auth.js';
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Analytics and summary endpoints (Analyst & Admin)
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Full dashboard overview — summary, categories, monthly trends, recent activity
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema: { type: integer, example: 2024 }
 *         description: Year for monthly trends (defaults to current year)
 *     responses:
 *       200:
 *         description: Combined dashboard data
 */
router.get('/', authenticate, authorize('analyst', 'admin'),getOverview);

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Total income, expenses, net balance and transaction counts
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary figures
 */
router.get('/summary', authenticate, authorize('analyst', 'admin'),getSummary);

/**
 * @swagger
 * /api/dashboard/categories:
 *   get:
 *     summary: Totals grouped by category
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [income, expense] }
 *         description: Filter by record type
 *     responses:
 *       200:
 *         description: Category breakdown
 */
router.get('/categories', authenticate, authorize('analyst', 'admin'),getCategoryTotals);

/**
 * @swagger
 * /api/dashboard/trends/monthly:
 *   get:
 *     summary: Monthly income vs expense trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema: { type: integer, example: 2024 }
 *     responses:
 *       200:
 *         description: Month-by-month breakdown
 */
router.get('/trends/monthly', authenticate, authorize('analyst', 'admin'), getMonthlyTrends);

/**
 * @swagger
 * /api/dashboard/trends/weekly:
 *   get:
 *     summary: Weekly income vs expense trends (last 8 weeks)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Week-by-week breakdown
 */
router.get('/trends/weekly', authenticate, authorize('analyst', 'admin'),getWeeklyTrends);

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Recent financial activity
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Recent records
 */
router.get('/recent', authenticate, authorize('analyst', 'admin'),getRecentActivity);

export default router