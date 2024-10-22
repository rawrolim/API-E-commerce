import { Request, Response } from "express";
import Stripe from "stripe";
import UserInterface from "../interfaces/UserInterface";
import { StatusOrderEnum } from "../enums/StatusOrderEnum";
import { query } from "../configs/pg";
import { getUserById } from "./auth";

export async function getPaymentLink(req: Request, res: Response) {
    try {
        if (!process.env.STRIPE_KEY)
            throw new Error("Need to inform the stripe key");

        const stripe = new Stripe(process.env.STRIPE_KEY);

        const user: UserInterface = req.body.user;

        const order = user.orders.find(order => order.status == 'OPEN');
        
        if(!order)
            throw new Error("Need one order in status open.");

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: order.products.map(orderProduct => {
                return {
                    price_data: {
                        currency: "brl",
                        product_data: {
                            name: orderProduct.product.name,
                            description: orderProduct.product.description
                        },
                        unit_amount: orderProduct.product.value * 100,
                    },
                    quantity: orderProduct.qtd
                }
            }),
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/checkout/success`,
            cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
        });

        await query("UPDATE orders SET checkout_id = $1, status = 'PROCESSING' WHERE id = $2",[session.id,order.id]);

        res.json({ url: session.url}).status(200);
    } catch (err: any) {
        res.json(err.toString()).status(400);
    }
}

export async function paymentSuccess(req: Request, res: Response) {
    try {
        const userOld: UserInterface = req.body.user;

        const order = userOld.orders.find(order => order.status == 'PROCESSING');
        
        if(!order)
            throw new Error("Need one order in status processing.");
        
        await query("UPDATE orders SET status = 'DONE' WHERE id = $1", [order.id])
        
        const user = getUserById(userOld.id);
        
        res.json(user).status(200);
    } catch (err: any) {
        res.json(err.toString()).status(400);
    }
}

export async function paymentCancel(req: Request, res: Response) {
    try {
        const userOld: UserInterface = req.body.user;

        const order = userOld.orders.find(order => order.status == 'PROCESSING');
        
        if(!order)
            throw new Error("Need one order in status processing.");
        
        await query("UPDATE orders SET status = 'CANCELED' WHERE id = $1", [order.id])
        
        const user = getUserById(userOld.id);

        res.json(user).status(200);
    } catch (err: any) {
        res.json(err.toString()).status(400);
    }
}