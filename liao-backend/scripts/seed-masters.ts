
import prisma from '../src/config/database';
import bcrypt from 'bcryptjs';


async function main() {
    const masters = [
        {
            email: 'bispodeivisnan@gmail.com',
            name: 'Deivisnan',
            password: process.env.SEED_MASTER_PASS_1 || 'change-me-in-production',
        },
        {
            email: 'liaoufba@gmail.com',
            name: 'LIAO',
            password: process.env.SEED_MASTER_PASS_2 || 'change-me-in-production',
        },
    ];

    console.log('Seeding Master Admins...');

    for (const master of masters) {
        const hashedPassword = await bcrypt.hash(master.password, 10);

        const user = await prisma.user.upsert({
            where: { email: master.email },
            update: {
                password: hashedPassword,
                role: 'master',
                name: master.name,
            },
            create: {
                email: master.email,
                name: master.name,
                password: hashedPassword,
                role: 'master',
            },
        });
        console.log(`Upserted master admin: ${user.email}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
