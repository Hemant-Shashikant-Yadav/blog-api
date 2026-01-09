import { logger } from "@/lib/winstone";

import User from '@/models/user'

import type { Request, Response, NextFunction } from 'express'

export type AuthRole = 'admin' | 'user'

const authorize = (roles: AuthRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req

        try {

            if (!userId) {
                return res.status(404).json({
                    message: 'User Not Found',
                    code: 'Not Found',
                })
            }

            const user = await User.findById(userId).select('role').exec();

            if (!user) {
                return res.status(404).json({
                    message: 'User Not Found',
                    code: 'Not Found',
                })
            }

            if (!roles.includes(user.role)) {
                return res.status(403).json({
                    message: 'Access denied, insufficient permission',
                    code: 'AuthorizationError',
                })
            }

            return next()
        } catch (error) {
            logger.error('Error while authorizing user', error);
            return res.status(500).json({
                message: 'Internal Server Error',
                code: 'InternalServerError',
            })
        }
    }
}

export default authorize