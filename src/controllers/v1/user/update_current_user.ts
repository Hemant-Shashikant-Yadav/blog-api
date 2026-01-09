import { logger } from "@/lib/winstone";

import User from "@/models/user";

import type { Request, Response } from "express";

const updateCurrentUser = async (req: Request, res: Response) => {
    const { userId } = req;
    const { username, email, password, first_name, last_name, website, facebook, instagram, linkedin, x, youtube } = req.body;

    try {
        const user = await User.findById(userId).select('+password -__v').exec();

        if (!user) {
            return res.status(404).json({
                message: 'User Not Found',
                code: 'Not Found',
            })
        }

        if (username) {
            user.username = username;
        }
        if (email) {
            user.email = email;
        }
        if (password) {
            user.password = password;
        }
        if (first_name) {
            user.firstName = first_name;
        }
        if (last_name) {
            user.lastName = last_name;
        }
        if (!user.socialLinks) {
            user.socialLinks = {};
        }
        if (website) {
            user.socialLinks.website = website;
        }
        if (facebook) {
            user.socialLinks.facebook = facebook;
        }
        if (instagram) {
            user.socialLinks.instagram = instagram;
        }
        if (linkedin) {
            user.socialLinks.linkedin = linkedin;
        }
        if (x) {
            user.socialLinks.x = x;
        }
        if (youtube) {
            user.socialLinks.youtube = youtube;
        }


        await user.save();
        logger.info('User Updated Successfully', user)

        return res.status(200).json({
            message: 'User Updated',
            code: 'Success',
            data: user,
        })
    } catch (error) {
        logger.error('Error while updating current user', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            code: 'InternalServerError',
        })
    }
}

export default updateCurrentUser;