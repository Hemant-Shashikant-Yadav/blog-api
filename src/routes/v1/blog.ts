import { Router } from 'express';
import { body } from 'express-validator';

import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';


import create_blog from '@/controllers/v1/blog/create_blog';

const router = Router();

router.post(
  '/create_blog',
  authenticate,
  authorize(['admin', 'user']),
  create_blog,
);

export default router;
