import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const founders = [
    "Beatriz Pereira Espinheira",
    "Danielle Santos de Souza",
    "DEIVISNAN DA SILVA BISPO",
    "Djair Maykon de Novaes Miranda",
    "Eduarda Almeida",
    "Ícaro Iêne da Silva Dias",
    "Jaedson Barbosa Macedo",
    "José Henrique do Espírito Santo Santana",
    "Laura Ferreira",
    "Lucca Oliveira Seixas",
    "Malu Pinto de Brito",
    "Paulo Ferreira de Castro Filho",
    "Priscila Conceição Araújo",
    "Tarcisio de Assis Pereira Brito", // Will check for explicit photo match if needed later, using name for now
    "Thales Brito Rodrigues",
    "Ulysses",
    "Yuri Freitas Hughes"
];

async function main() {
    console.log('Seeding founders...');

    for (const name of founders) {
        // Check if exists by email (generated from name) to avoid duplicates
        const email = `${name.split(' ')[0].toLowerCase()}.${name.split(' ').pop()?.toLowerCase()}@liao.com`;

        const existing = await prisma.member.findFirst({
            where: {
                OR: [
                    { name: { equals: name, mode: 'insensitive' } },
                    { email: email }
                ]
            }
        });

        if (!existing) {
            await prisma.member.create({
                data: {
                    name,
                    email,
                    role: 'member',
                    isFounder: true,
                    course: 'N/A', // Default, can be edited
                    year: 2024, // Assuming foundation year or past
                    isActive: false, // Founders might not be active current members
                    bio: 'Membro Fundador da LIAO'
                }
            });
            console.log(`Created founder: ${name}`);
        } else {
            // Update to ensure isFounder is true
            await prisma.member.update({
                where: { id: existing.id },
                data: { isFounder: true }
            });
            console.log(`Updated founder status: ${name}`);
        }
    }

    console.log('Seeding complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
