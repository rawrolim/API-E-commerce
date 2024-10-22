import { Request, Response } from "express";
import { query } from "../configs/pg";
import UserInterface from "../interfaces/UserInterface";
import OrderInterface from "../interfaces/OrderInterface";
import OrderProductInterface from "../interfaces/OrderProductInterface";
import ProductInterface from "../interfaces/ProductInterface";

export async function getOrdersByUser(req: Request, res: Response) {
    try {
        const user: UserInterface = req.body.user;
        const orders = [...user.orders];
        res.json(orders).status(200);
    } catch (err: any) {
        res.json(err.toString()).status(400);
    }
}

export async function getAllOrders(req: Request, res: Response) {
    try {
        let sql = `SELECT * FROM order WHERE user_id = $1`;
        const rs_orders: OrderInterface[] = await query(sql);

        rs_orders.map(async order => {
            const sql = `SELECT * FROM order_products WHERE order_id = $1`;
            const rs_product: OrderProductInterface[] = await query(sql, [order.id]);
            order.products = [...rs_product];

            order.products.map(async orderProduct => {
                const sql = `SELECT * FROM products WHERE id = $1`;
                const rs_product: ProductInterface[] = await query(sql, [orderProduct.product_id]);
                if (rs_product.length == 1)
                    orderProduct.product = rs_product[0];
            });
        });
        const orders = [...rs_orders];

        res.json(orders).status(200);
    } catch (err: any) {
        res.json(err.toString()).status(400);
    }
}


export async function createProduct(req: Request, res: Response) {
    try {
        const body: ProductInterface = req.body;

        if (!body.name)
            throw new Error("Need to inform the name of the product");
        if (!body.description)
            throw new Error("Need to inform the description of the product");
        if (!body.value)
            throw new Error("Need to inform the value");
        if (!body.category)
            throw new Error("Need to inform the category");

        const sql = `INSERT INTO products(
            name,
            description,
            value,
            category
        ) VALUES($1,$2,$3,$4)`;

        await query(sql, [body.name, body.description, body.value]);

        res.json().status(200);
    } catch (err: any) {
        res.json(err.toString()).status(400);
    }
}

export async function updateProduct(req: Request, res: Response) {
    try {
        const body: ProductInterface = req.body;

        if (!body.name)
            throw new Error("Need to inform the name of the product");
        if (!body.description)
            throw new Error("Need to inform the description of the product");
        if (!body.value)
            throw new Error("Need to inform the value");
        if (!req.params.id)
            throw new Error("Need to inform the id");

        const sql = `UPDATE products SET
            name = $1,
            description = $2,
            value = $3,
            updated_at = $4,
            WHERE id = $5
        `;

        await query(sql, [body.name, body.description, body.value, new Date(), req.params.id]);

        res.json().status(200);
    } catch (err: any) {
        res.json(err.toString()).status(400);
    }
}

export async function deleteProduct(req: Request, res: Response) {
    try {
        if (!req.params.id)
            throw new Error("Need to inform the id");

        const sql = `DELETE FROM products WHERE id = $1`;

        await query(sql, [req.params.id]);

        res.json().status(200);
    } catch (err: any) {
        res.json(err.toString()).status(400);
    }
}
