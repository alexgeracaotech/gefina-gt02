import { Pool } from 'pg';

if (!process.env.DATABASE_URL)
    throw new Error('A variável DATABASE_URL não está disponível.');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default pool;
