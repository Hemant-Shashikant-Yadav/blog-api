import { Router } from 'express';
import { body } from 'express-validator';

//Controller
import register from '@/controllers/v1/auth/register';

// Middlewares
import validationError from '@/middlewares/validationError';

// Models
import User from '@/models/user';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 example: "admin | user"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 status:
 *                   type: string
 *                   example: "success"
 *       400:
 *         description: Bad request - validation error
 *       409:
 *         description: User already exists
 */
// router.post('/register', register)
router.post(
  '/register',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email is not valid')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .custom(async (email: string) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error('User already exists');
      }
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['admin', 'user'])
    .withMessage('Role must be either admin or user'),
  validationError,
  register,
);

export default router;
