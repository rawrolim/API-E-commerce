import { Request, Response } from "express";
import { query } from "../configs/pg";
import { getUserById } from "./auth";
import { StatusOrderEnum } from "../enums/StatusOrderEnum";
import UserInterface from "../interfaces/UserInterface";
import OrderInterface from "../interfaces/OrderInterface";

export async function getOrderById(req: Request, res: Response) {
    try {
        if (!req.params.order_id)
            throw new Error("Order id need to inform");

        const user: UserInterface = req.body.user;
        const order = user.orders.find(order => order.id == Number(req.params.order_id));
        res.status(200).json(order);
    } catch (err: any) {
        res.status(400).json(err.toString());
    }
}

export async function updateProductOnOrder(req: Request, res: Response) {
    try {
        const body = req.body;
        let user: UserInterface = body.user;
        let sql = '';

        if (!body.product_id)
            throw new Error("Product not informed");
        if (!body.address_id)
            throw new Error("Address not informed");
        if (!body.qtd)
            throw new Error("Quantity of the product not informed");

        const addressExist = user.address.find(a => a.id == body.address_id);
        if(!addressExist)
            throw new Error("The address don't exist for this user");

        let orderOpened = user.orders.find(order => order.status == 'OPEN');

        if (orderOpened) {
            await query("UPDATE orders SET updated_at = $1, address_id = $2 WHERE id = $3", [new Date(), body.address_id, orderOpened.id]);
        } else {
            await query("INSERT INTO orders(user_id, address_id) VALUES($1, $2)", [user.id, body.address_id]);
            const order: OrderInterface[] = await query("SELECT * FROM orders WHERE user_id = $1 AND status = 'OPEN' LIMIT 1", [user.id]);
            user.orders.push(order[0]);
            orderOpened = order[0];
            orderOpened.products = [];
        }

        const productInOrder = orderOpened.products.find(product => product.id == body.product_id);

        if (productInOrder) {
            sql = `
            UPDATE order_products SET 
                qtd = $1,
                updated_at = $2
            WHERE order_id = $3
                AND product_id = $4`;
            let values = [body.qtd, new Date(), productInOrder.order_id, productInOrder.product_id];
            await query(sql, values)
        } else {
            sql = `INSERT INTO order_products(qtd, product_id, order_id)
                VALUES($1,$2,$3)`
            let values = [body.qtd, body.product_id, orderOpened.id];
            await query(sql, values)
        }

        user = await getUserById(user.id);

        res.status(200).json(user);
    } catch (err: any) {
        res.status(400).json(err.toString());
    }
}

export async function deleteOrder(req: Request, res: Response) {
    try {
        if (!req.params.order_id)
            throw new Error("Need inform order id");

        await query(`DELETE FROM order_products WHERE order_id = $1`, [req.params.order_id]);

        res.json().status(200);
    } catch (err: any) {
        res.json(err.toString()).status(400);
    }
}