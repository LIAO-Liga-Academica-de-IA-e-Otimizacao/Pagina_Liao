
import prisma from '../src/config/database';

async function main() {
    console.log('Seeding members...');

    // 1. Create a Director (Founder)
    await prisma.member.create({
        data: {
            name: 'Alice Diretora',
            email: 'alice@liao.com',
            role: 'director',
            isFounder: true,
            bio: 'Diretora Geral e Fundadora. Apaixonada por otimização.',
            course: 'Engenharia de Computação',
            year: 2024,
            photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
    });

    // 2. Create a Director (Not Founder)
    await prisma.member.create({
        data: {
            name: 'Bob Diretor',
            email: 'bob@liao.com',
            role: 'director',
            isFounder: false,
            bio: 'Diretor de Projetos. Focado em entregas de qualidade.',
            course: 'Ciência da Computação',
            year: 2024,
            photo: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
    });

    // 3. Create a Regular Member (Founder)
    await prisma.member.create({
        data: {
            name: 'Charlie Fundador',
            email: 'charlie@liao.com',
            role: 'member',
            isFounder: true,
            bio: 'Membro fundador. Especialista em Python.',
            course: 'Sistemas de Informação',
            year: 2024,
            photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
    });

    // 4. Create a Regular Member (New)
    await prisma.member.create({
        data: {
            name: 'Diana Membro',
            email: 'diana@liao.com',
            role: 'member',
            isFounder: false,
            bio: 'Entrou recentemente. Aprendendo muito sobre IA.',
            course: 'Engenharia de Software',
            year: 2025,
            // No photo to test default avatar
        },
    });

    console.log('Members seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
