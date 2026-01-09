import { Router } from 'express';

const router = Router();

import authRoutes from '@/routes/v1/auth';
import userRoutes from '@/routes/v1/users';

/**
 * @swagger
 * /api/v1:
 *   get:
 *     summary: API health check
 *     description: Returns API status and basic information
 *     tags:
 *       - Health Check
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "API is live"
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 timestamp:
 *                   type: string
 *                   example: "12/25/2023, 10:30:45 AM"
 */
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'success',
    version: '1.0.0',
    timestamp: new Date().toLocaleString('en-US', { timeZone: 'ist' }),
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
