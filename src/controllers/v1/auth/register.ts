import { logger } from '@/lib/winstone';
import config from '@/config';

// Models
import User from '@/models/user';

// Types
import { Request, Response } from 'express';
import user, { IUser } from '@/models/user';
import { generateUsername } from '@/utils';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body as UserData;
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

    res.status(200).json({
      message: 'User registered successfully',
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
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
