import { Router } from 'express';
import * as adminService from './admin.service.js';
import { authenticate, authorize } from '../auth/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get admin statistics
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: The statistics of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserStats'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 hasNextPage:
 *                   type: boolean
 *                 hasPreviousPage:
 *                   type: boolean
 *       403:
 *         description: Forbidden, user is not an admin
 *       500:
 *         description: Internal server error
 */
router.get('/stats', authenticate, authorize(['ADMIN']), async (req, res) => {
  const { page, limit } = req.query;
  try {
    const stats = await adminService.getStats(parseInt(page) || 1, parseInt(limit) || 10);
    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;