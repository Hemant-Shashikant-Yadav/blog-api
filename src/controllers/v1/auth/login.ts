import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winstone';

// Model
import User from '@/models/user';
import Token from '@/models/token';

// Types
import { Request, Response } from 'express';
import type { IUser } from '@/models/user';

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body as Pick<IUser, 'email' | 'password'>;

    try {
        const user = await User.findOne({ email })
            .select('username email password role')
            .lean()
            .exec();

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                code: 'UserNotFound',
            });
        }

        // const isMatch = await user.comparePassword(password);
        // if (!isMatch) {
        //     return res.status(401).json({
        //         message: 'Invalid credentials',
        //         code: 'InvalidCredentials',
        //     });
        // }

        // Geneate access token and refresh token
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Store refresh token in db
        await Token.create({
            token: refreshToken,
            userId: user._id,
        });
        logger.info('Refresh token stored in database', {
            userId: user._id,
            token: refreshToken,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(200).json({
            message: 'User logged in successfully',
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
            },
            accessToken,
        });

        logger.info('User logged in successfully', { userId: user });
    } catch (error) {
        logger.error('Error during user login:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error,
            code: 'ServerError',
        });
    }
};

export default login;
