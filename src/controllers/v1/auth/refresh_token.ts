import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { generateAccessToken, verifyRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winstone";

import Token from "@/models/token";

import { Request, Response } from "express";
import { Types } from "mongoose";

const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        logger.warn("Refresh token not provided");
        return res.status(401).json({
            message: "Unauthorized",
            code: "Unauthorized",
        });
    }

    try {
        const token = await Token.findOne({ token: refreshToken });

        if (!token) {
            logger.warn("Refresh token not found in database");
            return res.status(401).json({
                message: "Unauthorized",
                code: "Unauthorized",
            });
        }

        const jwtPayload = verifyRefreshToken(refreshToken) as {
            userId: Types.ObjectId;
        };

        const accessToken = generateAccessToken(jwtPayload.userId);

        res.status(200).json({
            message: "Token refreshed successfully",
            accessToken,
        });

        logger.info("Token refreshed successfully", { userId: jwtPayload.userId });
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            logger.warn("Refresh token expired");
            return res.status(401).json({
                message: "Refresh token is expired.",
                code: "Unauthorized",
            });
        } else if (error instanceof JsonWebTokenError) {
            logger.warn("Invalid refresh token");
            return res.status(401).json({
                message: "Unauthorized",
                code: "Unauthorized",
            });
        } else {
            logger.error("Error during token refresh:", error);
            return res.status(500).json({
                message: "Internal Server Error",
                code: "ServerError",
            });
        }
    }
};

export default refreshToken;