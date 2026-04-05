import express from 'express';
import { getAllRecords,getDeletedRecords,getRecordById,createRecord,updateRecord,deleteRecord,hardDeleteRecord,restoreRecord } from '../controllers/recordController.js';
import { authenticate,authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { validateCreateRecord,validateUpdateRecord } from '../validators/schema.js';

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Financial Records
 *   description: CRUD operations for financial records
 */

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get all financial records with filters & pagination
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [income, expense] }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *         example: "2024-01-01"
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *         example: "2024-12-31"
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search in title, notes, category
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, default: date }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *     responses:
 *       200:
 *         description: Paginated financial records
 */
router.get(
  '/',
  authenticate,
  authorize('viewer', 'analyst', 'admin'),getAllRecords
);

/**
 * @swagger
 * /api/records/deleted:
 *   get:
 *     summary: Get soft-deleted records (Admin only)
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Paginated deleted records
 */
router.get('/deleted', authenticate, authorize('admin'),getDeletedRecords);

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     summary: Get a single record by ID
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Financial record details
 *       404:
 *         description: Record not found
 */
router.get('/:id', authenticate, authorize('viewer', 'analyst', 'admin'),getRecordById);

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a new financial record (Admin only)
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, amount, type, category]
 *             properties:
 *               title: { type: string, example: "Monthly Salary" }
 *               amount: { type: number, example: 5000 }
 *               type: { type: string, enum: [income, expense], example: "income" }
 *               category: { type: string, example: "salary" }
 *               date: { type: string, format: date, example: "2024-04-01" }
 *               notes: { type: string, example: "April salary payment" }
 *     responses:
 *       201:
 *         description: Record created
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(validateCreateRecord),
  createRecord
);

/**
 * @swagger
 * /api/records/{id}:
 *   patch:
 *     summary: Update a financial record (Admin only)
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               amount: { type: number }
 *               type: { type: string, enum: [income, expense] }
 *               category: { type: string }
 *               date: { type: string, format: date }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Record updated
 *       404:
 *         description: Record not found
 */
router.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(validateUpdateRecord),
  updateRecord
);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Soft delete a record (Admin only)
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Record soft-deleted
 *       404:
 *         description: Record not found
 */
router.delete('/:id', authenticate, authorize('admin'),deleteRecord);

/**
 * @swagger
 * /api/records/{id}/hard-delete:
 *   delete:
 *     summary: Permanently delete a record (Admin only)
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Record permanently deleted
 */
router.delete('/:id/hard-delete', authenticate, authorize('admin'),hardDeleteRecord);

/**
 * @swagger
 * /api/records/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted record (Admin only)
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Record restored
 *       400:
 *         description: Record is not deleted
 */
router.patch('/:id/restore', authenticate, authorize('admin'),restoreRecord);

export default router