import { logger } from "@/lib/winstone";

import User from "@/models/user";

import type { Request, Response } from "express";

const deleteCurrentUser = async (req: Request, res: Response) => {
    const { userId } = req;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User Not Found',
                code: 'Not Found',
            })
        }

        await User.deleteOne({ _id: userId });
        logger.info('User deleted Successfully', user)

        return res.status(200).json({
            message: 'User deleted',
            code: 'Success',
            data: user,
        })
    } catch (error) {
        logger.error('Error while deleting current user', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            code: 'InternalServerError',
        })
    }
}

export default deleteCurrentUser;