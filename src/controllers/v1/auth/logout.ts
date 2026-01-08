import { logger } from "@/lib/winstone";
import config from "@/config";

import Token from '@/models/token'

import type { Request, Response } from 'express'

const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        logger.warn('No refresh token provided');
        return res.status(401).json({
            message: 'No refresh token provided',
            code: 'NoRefreshToken',
        });
    }

    try {
        await Token.findOneAndDelete({ token: refreshToken });
        logger.info('Refresh token deleted from database');
        res.clearCookie('refreshToken', {
            httpOnly: true, secure: config.NODE_ENV === 'production', sameSite: 'strict'
        });
        logger.info('Refresh token cookie cleared');
        logger.info('User logged out successfully');
        res.status(200).json({
            message: 'User logged out successfully',
        });
    } catch (error) {
        logger.error('Error during logout:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error,
            code: 'ServerError',
        });
    }
};

export default logout;