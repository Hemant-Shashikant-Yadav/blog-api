import { logger } from "@/lib/winstone";

import User from "@/models/user";

import type { Request, Response } from "express";

const getCurrentUser = async (req: Request, res: Response) => {
    const { userId } = req;

    try {
        const user = await User.findById(userId).select('-__v').lean().exec();

        if (!user) {
            return res.status(404).json({
                message: 'User Not Found',
                code: 'Not Found',
            })
        }

        return res.status(200).json({
            message: 'User Found',
            code: 'Success',
            data: user,
        })
    } catch (error) {
        logger.error('Error while getting current user', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            code: 'InternalServerError',
        })
    }
}

export default getCurrentUser;