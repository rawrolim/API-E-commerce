import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { query } from "../configs/pg";
import UserInterface from '../interfaces/UserInterface';
import { getUserById } from '../controllers/auth';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { headers } = req;
        let user = null;

        if (!headers.authorization)
            throw new Error("Unauthorized");

        jwt.verify(headers.authorization, String(process.env.JWT_SECRET));

        const jwtData: any = jwt.decode(headers.authorization)

        if (jwtData.accessToken) {
            let sql = `SELECT 
                id,
                name,
                email,
                active,
                email_verified
            FROM users WHERE id=$1 AND access_token=$2`;
            const rs_user: UserInterface[] = await query(sql, [jwtData.userId, jwtData.accessToken]);

            if (rs_user.length == 0)
                throw new Error("User not found");

            user = rs_user[0];

            user = await getUserById(user.id);

            req.body.user = user;
        }

        next();
    } catch (err: any) {
        res.json(err.toString()).status(401);
    }
}

export async function authAdminMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { headers } = req;
        let user = null;

        if (!headers.authorization)
            throw new Error("Unauthorized");

        jwt.verify(headers.authorization, String(process.env.JWT_SECRET));

        const jwtData: any = jwt.decode(headers.authorization)

        if (jwtData.accessToken) {
            const sql = `SELECT 
                id,
                name,
                email,
                active,
                email_verified,
                is_admin
            FROM users WHERE id=$1 AND access_token=$2`;
            const rs_user: UserInterface[] = await query(sql, [jwtData.userId, jwtData.accessToken]);

            if (rs_user.length == 0)
                throw new Error("User not found");

            user = rs_user[0];

            if (!user.is_admin)
                throw new Error("Unauthorized");

            req.body.user = user;
        }

        next();
    } catch (err: any) {
        res.json(err.toString()).status(401);
    }
}
