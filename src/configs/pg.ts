import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'rawrolim',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'emprestimo',
    password: process.env.POSTGRES_PASSWORD || 'root',
    port: Number(process.env.POSTGRES_PORT) || 5432,
});

export const query = async (text: string, params:any[]=[]) => (await pool.query(text, params)).rows
