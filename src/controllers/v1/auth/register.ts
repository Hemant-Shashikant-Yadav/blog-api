import { logger } from '@/lib/winstone';
import config from '@/config';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

// Models
import User from '@/models/user';
import Token from '@/models/token';

// Types
import { Request, Response } from 'express';
import user, { IUser } from '@/models/user';
import { generateUsername } from '@/utils';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body as UserData;

  if (role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
    logger.warn('Forbidden: Only whitelisted admins can register as admin', {
      email,
    });
    return res.status(403).json({
      code: 'AuthorizationError',
      message: 'Forbidden: Only whitelisted admins can register as admin',
    });
  }
  try {
    // const userData: UserData = req.body;

    // const existingUser = await User.findOne({ email: userData.email });
    // if (existingUser) {
    //   return res.status(409).json({
    //     message: 'User already exists',
    //     code: 'UserExists',
    //   });
    // }

    // const newUser = new User(userData);
    // await newUser.save();

    const username = generateUsername();

    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    // Geneate access token and refresh token
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Store refresh token in db
    await Token.create({
      token: refreshToken,
      userId: newUser._id,
    });
    logger.info('Refresh token stored in database', {
      userId: newUser._id,
      token: refreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });

    logger.info('User registered successfully', { userId: newUser._id });
  } catch (error) {
    logger.error('Error during user registration:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error,
      code: 'ServerError',
    });
  }
};

export default register;
