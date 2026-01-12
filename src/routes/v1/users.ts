import { Router } from "express";
import { param, query, body } from "express-validator";

import authenticate from "@/middlewares/authenticate";
import validationError from "@/middlewares/validationError";
import authorize from "@/middlewares/authorize";

import user from "@/models/user";

import getCurrentUser from "@/controllers/v1/user/get_current_user";
import updateCurrentUser from "@/controllers/v1/user/update_current_user";
import deleteCurrentUser from "@/controllers/v1/user/delete_current_user";

const router = Router();

/**
 * @swagger
 * /api/v1/users/current:
 *   get:
 *     summary: Get current user
 *     description: Retrieve the current authenticated user's information
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User Found"
 *                 code:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "john@example.com"
 *                     role:
 *                       type: string
 *                       enum: ["admin", "user"]
 *                       example: "user"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00.000Z"
 *       401:
 *         description: Unauthorized - Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User Not Found"
 *                 code:
 *                   type: string
 *                   example: "Not Found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 code:
 *                   type: string
 *                   example: "InternalServerError"
 */
router.get('/current', authenticate, authorize(['admin', 'user']), getCurrentUser)

/**
 * @swagger
 * /api/v1/users/current:
 *   put:
 *     summary: Update current user
 *     description: Update the current authenticated user's information
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 description: User's username (optional)
 *                 example: "johndoe"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 code:
 *                   type: string
 *                   example: "Success"
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized - Invalid or missing access token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.put('/current', authenticate, authorize(['admin', 'user']), body('username').optional().trim().isLength({ min: 3, max: 20 }).withMessage('Username must'), updateCurrentUser)

/**
 * @swagger
 * /api/v1/users/current:
 *   delete:
 *     summary: Delete current user
 *     description: Delete the current authenticated user's account
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *                 code:
 *                   type: string
 *                   example: "Success"
 *       401:
 *         description: Unauthorized - Invalid or missing access token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/current', authenticate, authorize(['admin', 'user']), body('username').optional().trim().isLength({ min: 3, max: 20 }).withMessage('Username must'), deleteCurrentUser)

export default router