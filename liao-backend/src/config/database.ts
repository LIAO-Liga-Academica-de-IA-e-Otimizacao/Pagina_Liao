import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Load environment variables
dotenv.config();

console.log('[Database] DATABASE_URL present:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    console.log('[Database] DATABASE_URL starts with:', process.env.DATABASE_URL.substring(0, 20));
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

// Debug connection
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});
console.log(`[Database] Initializing pool with SSL: ${process.env.NODE_ENV === 'production'}`);

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error'],
});

export default prisma;

