import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { verifyAccessToken } from "@/lib/jwt";
import { logger } from "@/lib/winstone";

import type { Request, Response, NextFunction } from "express";
import type { Types } from "mongoose";

/**
 * @function authenticate
 * @description Middleware to verify the user's access token from Authorization header.
 *              If the token is valid, the user's ID is attached to the request object.
 *              Otherwise, it returns an appropriacte error response.
 * @param {Request} req - Express request object. Expects a Bearer token in the Authorization header.
 * @param {Response} res - Express response object used to send error response if authentication fails.
 * @param {NextFunction} next - Express next function to pass control to the next middleware.
 *  
 * @returns {void}
 * @throws Error
 */
const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        logger.warn('No token provided');
        return res.status(401).json({
            message: 'Access denied, No token provided',
            code: 'AuthenticationError',
        });
    }

    try {
        const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

        req.userId = jwtPayload.userId;

        return next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            logger.warn('Token expired');
            return res.status(401).json({
                message: 'Token expired',
                code: 'TokenExpired',
            });
        } else if (error instanceof JsonWebTokenError) {
            logger.warn('Invalid token');
            return res.status(401).json({
                message: 'Invalid token',
                code: 'InvalidToken',
            });
        } else {
            logger.error('Error during token verification:', error);
            return res.status(500).json({
                message: 'Internal Server Error',
                error: error,
                code: 'ServerError',
            });
        }
    }
};

export default authenticate;