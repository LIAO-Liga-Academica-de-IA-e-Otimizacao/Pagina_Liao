
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

console.log('Using DB URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

async function main() {
    const email = 'admin@liao.com';
    const password = 'admin'; // Temporary password
    const name = 'Admin Liao';

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Connecting to database...');
    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name,
            password: hashedPassword,
            role: 'admin'
        },
    });

    console.log('✅ Admin user created:', user);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
