import md5 from "md5";
import jwt from 'jsonwebtoken';
import { generateToken } from '../configs/functions';
import { query } from "../configs/pg";
import { Request, Response } from "express";
import UserInterface from "../interfaces/UserInterface";
import OrderInterface from "../interfaces/OrderInterface";
import OrderProductInterface from "../interfaces/OrderProductInterface";
import ProductInterface from "../interfaces/ProductInterface";
import Stripe from "stripe";

const tempo = 60 * 60;

export async function login(req: Request, res: Response) {
    try {
        const body = req.body;

        const rs_user: UserInterface[] = await query("SELECT * FROM users WHERE email = $1", [body.email]);

        if (rs_user.length == 0)
            throw Error("User not found");

        const user = rs_user[0];

        const psw_encript = jwt.sign(md5(body.password), user.salt);

        if (psw_encript != user.password)
            throw new Error("Unathorized");

        if (!user.active)
            throw new Error("User is not active");

        const jwtData = {
            userId: user.id,
            userEmail: user.email,
            exp: Math.floor(Date.now() / 1000) + tempo,
            accessToken: generateToken(5)
        };

        const new_salt = generateToken(2)
        const new_password = jwt.sign(md5(body.password), new_salt);

        await query("UPDATE users SET access_token=$1, salt=$2, password=$3 WHERE id=$4", [jwtData.accessToken, new_salt, new_password, user.id]);

        const token = jwt.sign(jwtData, String(process.env.JWT_SECRET));
        res.status(200).json(token);
    } catch (err: any) {
        res.status(400).json(err.toString());
    }
}

export async function getUser(req: Request, res: Response) {
    try {
        const body = req.body;

        const user: UserInterface = body.user;

        res.status(200).json(user);
    } catch (err: any) {
        res.status(400).json(err.toString());
    }
}

export async function createUser(req: Request, res: Response) {
    try {
        const body: UserInterface = req.body;

        if (!body.email)
            throw new Error("Need to inform the email");
        if (!body.name)
            throw new Error("Need to inform the name");
        if (!body.password)
            throw new Error("Need to inform the password");

        const emailExist = await query("SELECT id FROM users WHERE email = $1",[body.email]);
        if(emailExist.length > 0)
            throw new Error("Duplicated email");

        let sql = `
            INSERT INTO users(
                name,
                email,
                password,
                salt,
                access_token
            ) VALUES($1,$2,$3,$4,$5)
        `;
        const salt = generateToken(2);
        const password = jwt.sign(md5(body.password), salt)
        let values = [body.name, body.email, password, salt, generateToken(5)]
        await query(sql, values);

        //Need create a function to send email

        res.json().status(200);
    } catch (err: any) {
        res.json(err.toString()).status(400);
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const body: UserInterface = req.body;

        if (!body.email)
            throw new Error("Need to inform the email");
        if (!body.name)
            throw new Error("Need to inform the name");

        let sql = `
            UPDATE users SET
                name = $1,
                email = $2,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3`;

        await query(sql, [body.name, body.email, req.body.user.id]);

        res.json().status(200);
    } catch (err: any) {
        res.json(err.toString()).status(400);
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const body: UserInterface = req.body;

        const sql = "UPDATE users SET active = false WHERE id = $1";
        await query(sql, [body.id]);

        res.json().status(200);
    } catch (err: any) {
        res.json(err.toString()).status(400);
    }
}

export async function getUserById(id: number) {
    let rs_productInterface: OrderProductInterface[];
    let rs_product: ProductInterface[];

    let sql = `SELECT id,
        name,
        email,
        active,
        email_verified
    FROM users WHERE id = $1`
    const user: UserInterface = (await query(sql, [id]))[0];

    sql = `SELECT * FROM orders WHERE user_id = $1`;
    const rs_orders: OrderInterface[] = await query(sql, [user.id]);

    for(let i = 0; i < rs_orders.length; i++){
        const sql = `SELECT * FROM order_products WHERE order_id = $1`;
        rs_productInterface = await query(sql, [rs_orders[i].id]);
        rs_orders[i].products = [...rs_productInterface];

        for( let j = 0; j < rs_orders[i].products.length; j++){
            const sql = `SELECT * FROM products WHERE id = $1`;
            rs_product = await query(sql, [rs_orders[i].products[j].product_id]);
            if (rs_product.length == 1)
                rs_orders[i].products[j].product = rs_product[0];
        }
    }

    user.orders = [...rs_orders];

    return user;
}