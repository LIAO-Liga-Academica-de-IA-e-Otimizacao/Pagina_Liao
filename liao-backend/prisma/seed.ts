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

  console.log(`✅ Seed finished! Event created: ${event.title}`);
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
