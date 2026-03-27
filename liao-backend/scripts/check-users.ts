import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkUsers() {
    try {
        const userCount = await prisma.user.count();
        console.log(`User count: ${userCount}`);
        if (userCount > 0) {
            const users = await prisma.user.findMany({
                select: { email: true, role: true }
            });
            console.log('Users:', JSON.stringify(users, null, 2));
        }
    } catch (error) {
        console.error('Error checking users:', error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

checkUsers();
