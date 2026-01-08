import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

const validationError = (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({
      message: 'Validation error',
      error: error.array(),
      code: 'ValidationError',
    });
  }

  next();
};

export default validationError;
