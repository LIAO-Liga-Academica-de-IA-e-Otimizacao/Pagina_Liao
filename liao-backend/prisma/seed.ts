import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create a few Members first so we can link them to events
  console.log('Creating members...');
  const member1 = await prisma.member.upsert({
    where: { email: 'alice@liao.com' },
    update: {},
    create: {
      name: 'Alice Oliveira',
      email: 'alice@liao.com',
      role: 'Coordenadora de Projetos',
      course: 'Engenharia de Computação',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      bio: 'Apaixonada por Visão Computacional e Otimização.',
      isActive: true,
      year: 2024
    },
  });

  const member2 = await prisma.member.upsert({
    where: { email: 'bruno@liao.com' },
    update: {},
    create: {
      name: 'Bruno Santos',
      email: 'bruno@liao.com',
      role: 'Desenvolvedor Full Stack',
      course: 'Ciência da Computação',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      bio: 'Entusiasta de sistemas distribuídos e infraestrutura.',
      isActive: true,
      year: 2025
    },
  });

  // 1.5 Create Partners
  console.log('Creating partners...');
  const partner1 = await prisma.partner.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Google Cloud',
      imageUrl: 'https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg',
      websiteUrl: 'https://cloud.google.com'
    }
  });

  const partner2 = await prisma.partner.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'GitHub',
      imageUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png',
      websiteUrl: 'https://github.com'
    }
  });

  const partner3 = await prisma.partner.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'NVIDIA',
      imageUrl: 'https://www.nvidia.com/content/dam/en-zz/Solutions/about-nvidia/logo-and-brand/01-nvidia-logo-vert-500x200-2c50-p@2x.png',
      websiteUrl: 'https://nvidia.com'
    }
  });

  // 2. Create a massive Event with relations
  console.log('Creating events...');
  const eventData = {
    title: 'Workshop IA Avançada: Do Zero ao Deploy',
    description: 'Um evento imersivo focado em construção de LLMs e deploy escalável em nuvem.',
    coverImage: 'https://images.unsplash.com/photo-1745674684463-62f62cb88d4c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    date: new Date('2026-05-20T14:00:00Z'),
    location: 'Auditório Magno - Instituto de Computação',
    highlights: [
      'Arquitetura de Transformers',
      'Fine-tuning com LoRA',
      'Deploy com Kubernetes',
      'Networking com Profissionais'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
    ],
    palette: ['#4F46E5', '#761515'],
    borderRadius: 'squared',
    fontClass: 'font-mono',
    subscribe: "https://example.com/subscribe",
    themeMode: 'dark',
  }; 

  const event = await prisma.event.upsert({
    where: { slug: 'workshop-ia-avancada-2026' },
    update: {
        ...eventData,
        partners: {
            set: [{ id: partner1.id }, { id: partner2.id }, { id: partner3.id }]
        }
    },
    create: {
      ...eventData,
      slug: 'workshop-ia-avancada-2026',
      agenda: {
        create: [
          { time: '14:00', title: 'Credenciamento', description: 'Recepção e entrega de kits.' },
          { time: '14:30', title: 'Keynote: O Estado da IA', speakerName: 'Dra. Helena Costa' },
          { time: '15:30', title: 'Hands-on: Fine-tuning', description: 'Prática guiada com PyTorch.' },
          { time: '17:00', title: 'Painel LIAO', description: 'Discussão aberta sobre pesquisa no Brasil.' }
        ]
      },
      speakers: {
        create: [
          {
            name: 'Dra. Helena Costa',
            role: 'Head of AI',
            company: 'TechCorp Global',
            photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
            link: 'https://linkedin.com/in/helenacosta'
          },
          {
            memberId: member1.id,
            role: 'Líder IC',
            link: 'https://github.com/alice'
          }
        ]
      },
      partners: {
        connect: [{ id: partner1.id }, { id: partner2.id }, { id: partner3.id }]
      }
    }
  });

  const lightEventData = {
    title: 'Simpósio de Otimização e Sustentabilidade',
    description: 'Um encontro aberto para discutir a aplicação de algoritmos de otimização no desenvolvimento de soluções sustentáveis e ecológicas.',
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1470&auto=format&fit=crop',
    date: new Date('2026-06-15T09:00:00Z'),
    location: 'Auditório 2 - Pavilhão de Aulas do IC',
    highlights: [
      'Modelagem Matemática Verde',
      'Smart Grids Eficientes',
      'Logística Reversa de Resíduos',
      'Descarbonização com IA'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    ],
    palette: ['#059669', '#0d9488', '#2563eb'],
    borderRadius: 'round',
    fontClass: 'font-space',
    subscribe: "https://example.com/subscribe-sustentabilidade",
    themeMode: 'light',
  };

  const lightEvent = await prisma.event.upsert({
    where: { slug: 'simposio-otimizacao-sustentabilidade-2026' },
    update: {
        ...lightEventData,
        partners: {
            set: [{ id: partner2.id }, { id: partner3.id }]
        }
    },
    create: {
      ...lightEventData,
      slug: 'simposio-otimizacao-sustentabilidade-2026',
      agenda: {
        create: [
          { time: '09:00', title: 'Abertura do Simpósio', description: 'Boas-vindas e apresentação da agenda.' },
          { time: '09:30', title: 'Palestras de Smart Grids', speakerName: 'Bruno Santos' },
          { time: '11:00', title: 'Algoritmos e Clima', description: 'Estudo prático de redução de CO2.' }
        ]
      },
      speakers: {
        create: [
          {
            memberId: member2.id,
            role: 'Pesquisador de Infraestrutura',
            link: 'https://github.com/bruno'
          }
        ]
      },
      partners: {
        connect: [{ id: partner2.id }, { id: partner3.id }]
      }
    }
  });

  console.log(`✅ Seed finished! Events created: ${event.title} (Dark), ${lightEvent.title} (Light)`);

  // 3. System Config
  console.log('Seeding system config...');
  await prisma.systemConfig.upsert({
    where: { key: 'CONTACT_EMAIL' },
    update: {},
    create: {
      key: 'CONTACT_EMAIL',
      value: 'contato@liao.com'
    }
  });

  // 4. Create Tutors
  console.log('Creating tutors...');
  await prisma.tutor.upsert({
    where: { email: 'carlos@liao.com' },
    update: {},
    create: {
      name: 'Carlos Alberto',
      email: 'carlos@liao.com',
      subjects: ['Cálculo I', 'Álgebra Linear', 'Física I'],
      bio: 'Tutor de exatas com foco em ajudar alunos nas disciplinas básicas do primeiro ano de engenharia e ciência.',
      availability: 'Segunda e Quarta, das 14h às 16h',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
    }
  });

  await prisma.tutor.upsert({
    where: { email: 'daniela@liao.com' },
    update: {},
    create: {
      name: 'Daniela Souza',
      email: 'daniela@liao.com',
      subjects: ['Estruturas de Dados', 'Programação Orientada a Objetos'],
      bio: 'Apaixonada por ensinar algoritmos, Java, C++ e desenvolvimento de software.',
      availability: 'Terça e Quinta, das 10h às 12h',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
