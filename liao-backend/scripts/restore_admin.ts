
import prisma from '../src/config/database';
import bcrypt from 'bcryptjs';

async function main() {
    const email = 'admin@liao.com';
    const password = 'admin';

    console.log(`Checking for user ${email}...`);

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        console.log('Admin user already exists.');
        console.log(`Email: ${email}`);
        console.log('Password: (unchanged)');
    } else {
        console.log('Creating admin user...');
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Admin',
                role: 'admin',
            },
        });

        console.log('Admin user created successfully!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
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
