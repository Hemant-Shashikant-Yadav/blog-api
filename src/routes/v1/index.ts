import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'success',
    version: '1.0.0',
    timestamp: new Date().toLocaleString('en-US', { timeZone: 'ist' }),
  });
});

export default router;
