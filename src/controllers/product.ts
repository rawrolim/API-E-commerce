import { Request, Response } from "express";
import ProductInterface from "../interfaces/ProductInterface";
import { query } from "../configs/pg";

export async function getProduct(req: Request, res: Response) {
    try {
        let sql = '';
        let rs_products: ProductInterface[] | undefined = undefined;

        if(!req.query.search)
            throw new Error("Need to inform one param to search");

        if (typeof req.query.search == 'string') {
            sql = `SELECT * FROM products WHERE UPPER(description) LIKE $1 OR UPPER(name) LIKE $1 OR UPPER(category) LIKE $1`;
            rs_products = await query(sql, ['%' + req.query.search.toUpperCase() + '%']);
        } else {
            sql = `SELECT * FROM products WHERE id = $1`;
            rs_products = await query(sql,[req.params.product_id]);
        }

        res.json(rs_products).status(200);
    } catch (err: any) {
        res.json(err.toString()).status(400);
    }
}

export async function getProductsByCategory(req: Request, res: Response) {
    try {
        if (!req.query.category)
            throw new Error("Need to inform the category");

        const sql = `SELECT * FROM products WHERE category = $1`;
        const rs_products: ProductInterface[] = await query(sql,[req.query.category]);

        res.json(rs_products).status(200);
    } catch (err: any) {
        res.json(err.toString()).status(400);
    }
}

export async function getAllProducts(req: Request, res: Response) {
    try {
        let sql = 'SELECT * FROM products WHERE active = true';
        const rs_products = await query(sql);

        res.json(rs_products).status(200);
    } catch (err: any) {
        res.json(err.toString()).status(400);
    }
}