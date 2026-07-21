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

  console.log(`✅ Seed finished! Past events created: ${event.title} (Dark), ${lightEvent.title} (Light)`);

  // Additional Finished Event (Past: March 2026)
  const pastEventData = {
    title: 'Minicurso: Introdução ao Python para Ciência de Dados',
    description: 'Minicurso prático introdutório cobrindo manipulação de dados com Pandas e NumPy e introdução a modelos preditivos.',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1470&auto=format&fit=crop',
    date: new Date('2026-03-10T14:00:00Z'),
    location: 'Laboratório de Informática 3 - IC UFBA',
    highlights: [
      'Fundamentos de Python',
      'Numpy & Pandas',
      'Visualização de Dados',
      'Casos Práticos'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
    ],
    palette: ['#D97706', '#B45309'],
    borderRadius: 'squared',
    fontClass: 'font-mono',
    themeMode: 'light',
  };

  await prisma.event.upsert({
    where: { slug: 'minicurso-python-dados-2026' },
    update: {
      ...pastEventData,
      partners: { set: [{ id: partner2.id }] }
    },
    create: {
      ...pastEventData,
      slug: 'minicurso-python-dados-2026',
      agenda: {
        create: [
          { time: '14:00', title: 'Instalação e Conceitos Fundamentais', description: 'Ambiente Jupyter e bibliotecas' },
          { time: '15:30', title: 'Análise Exploratória na Prática', description: 'Manipulação de conjuntos de dados reais' },
          { time: '17:00', title: 'Primeiro Modelo de Regressão', description: 'Scikit-learn hands-on' }
        ]
      },
      speakers: {
        create: [
          {
            memberId: member1.id,
            role: 'Instrutora Principal',
            link: 'https://github.com/alice'
          }
        ]
      },
      partners: { connect: [{ id: partner2.id }] }
    }
  });

  // Future Event 1 (September 2026)
  const futureEvent1Data = {
    title: 'Hackathon LIAO 2026: IA & Otimização Combinatória',
    description: '36 horas de maratona intensiva para criar soluções baseadas em Inteligência Artificial e Otimização para problemas do setor produtivo e social.',
    coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1470&auto=format&fit=crop',
    date: new Date('2026-09-12T08:00:00Z'),
    location: 'Auditório Principal & Hub de Inovação - UFBA',
    highlights: [
      'Maratona Prática de 36 Horas',
      'Premiação para Equipes Destaque',
      'Mentoria com Especialistas do Mercado',
      'Certificado e Certificação de Impacto'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
    ],
    palette: ['#2563EB', '#7C3AED'],
    borderRadius: 'round',
    fontClass: 'font-outfit',
    subscribe: 'https://example.com/hackathon-2026',
    themeMode: 'dark',
  };

  await prisma.event.upsert({
    where: { slug: 'hackathon-liao-2026' },
    update: {
      ...futureEvent1Data,
      partners: { set: [{ id: partner1.id }, { id: partner3.id }] }
    },
    create: {
      ...futureEvent1Data,
      slug: 'hackathon-liao-2026',
      agenda: {
        create: [
          { time: '08:00', title: 'Abertura & Formação de Equipes', description: 'Recepção, network e pitch de problemas' },
          { time: '09:00', title: 'Liberação dos Desafios', description: 'Início da maratona de desenvolvimento' },
          { time: '18:00', title: 'Checkpoint de Mentoria', description: 'Feedback técnico e validação de MVPs' }
        ]
      },
      speakers: {
        create: [
          {
            memberId: member2.id,
            role: 'Coordenador Técnico',
            link: 'https://github.com/bruno'
          }
        ]
      },
      partners: { connect: [{ id: partner1.id }, { id: partner3.id }] }
    }
  });

  // Future Event 2 (October 2026)
  const futureEvent2Data = {
    title: 'Semana da Inteligência Artificial e Otimização 2026',
    description: 'Edição 2026 da nossa semana acadêmica com palestras internacionais, workshops de ponta e apresentação de pesquisas inovadoras.',
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc596e?q=80&w=1470&auto=format&fit=crop',
    date: new Date('2026-10-20T09:00:00Z'),
    location: 'Centro de Convenções UFBA - PAF I',
    highlights: [
      'Palestras com Pesquisadores Internacionais',
      'Minicursos Práticos de Deep Learning',
      'Sessão de Pôsteres Acadêmicos',
      'Mesa Redonda: Ética e Futuro do Trabalho'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'
    ],
    palette: ['#0D9488', '#0284C7'],
    borderRadius: 'round',
    fontClass: 'font-space',
    subscribe: 'https://example.com/semana-ia-2026',
    themeMode: 'light',
  };

  await prisma.event.upsert({
    where: { slug: 'semana-da-ia-e-otimizacao-2026' },
    update: {
      ...futureEvent2Data,
      partners: { set: [{ id: partner1.id }, { id: partner2.id }, { id: partner3.id }] }
    },
    create: {
      ...futureEvent2Data,
      slug: 'semana-da-ia-e-otimizacao-2026',
      agenda: {
        create: [
          { time: '09:00', title: 'Solene de Abertura', description: 'Boas-vindas com a diretoria do LIAO' },
          { time: '10:00', title: 'Keynote: O Futuro dos Modelos Generativos', speakerName: 'Dra. Helena Costa' },
          { time: '14:00', title: 'Workshop: Otimização de Hiperparâmetros', description: 'Prática em cluster GPU' }
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
          }
        ]
      },
      partners: { connect: [{ id: partner1.id }, { id: partner2.id }, { id: partner3.id }] }
    }
  });

  // Future Event 3 (August 2026)
  const futureEvent3Data = {
    title: 'Bootcamp IA & Visão Computacional: Do Conceito à Aplicação',
    description: 'Imersão de 3 dias em Visão Computacional cobrindo processamento de imagens com OpenCV, arquiteturas de CNNs e detecção de objetos em tempo real com YOLO.',
    coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1470&auto=format&fit=crop',
    date: new Date('2026-08-25T13:00:00Z'),
    location: 'Laboratório de Redes e IA - Instituto de Computação',
    highlights: [
      'Processamento Digital de Imagens',
      'Treinamento de Modelos YOLO',
      'Segmentação e Rastreamento',
      'Deploy em Dispositivos Edge'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
    ],
    palette: ['#6366F1', '#EC4899'],
    borderRadius: 'round',
    fontClass: 'font-mono',
    subscribe: 'https://example.com/bootcamp-visao-2026',
    themeMode: 'dark',
  };

  await prisma.event.upsert({
    where: { slug: 'bootcamp-ia-visao-computacional-2026' },
    update: {
      ...futureEvent3Data,
      partners: { set: [{ id: partner1.id }, { id: partner2.id }] }
    },
    create: {
      ...futureEvent3Data,
      slug: 'bootcamp-ia-visao-computacional-2026',
      agenda: {
        create: [
          { time: '13:00', title: 'Fundamentos de Processamento de Imagens', description: 'Filtros, transformações e OpenCV' },
          { time: '15:00', title: 'Deep Learning para Visão', description: 'Redes convolucionais e transfer learning' },
          { time: '17:00', title: 'Prática de Detecção em Tempo Real', description: 'Execução de inferências no browser e edge' }
        ]
      },
      speakers: {
        create: [
          {
            memberId: member1.id,
            role: 'Instrutora de Visão Computacional',
            link: 'https://github.com/alice'
          }
        ]
      },
      partners: { connect: [{ id: partner1.id }, { id: partner2.id }] }
    }
  });

  // Future Event 4 (November 2026)
  const futureEvent4Data = {
    title: 'Encontro LIAO: Algoritmos de Otimização em Escala',
    description: 'Palestra técnica e mesa redonda focada em meta-heurísticas, algoritmos genéticos e solução de problemas NP-difíceis no setor logístico.',
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1470&auto=format&fit=crop',
    date: new Date('2026-11-15T15:00:00Z'),
    location: 'Auditório Magno - Instituto de Computação',
    highlights: [
      'Algoritmos Genéticos & Swarm Intelligence',
      'Otimização Estocástica e Robusta',
      'Casos de Sucesso na Indústria',
      'Sessão de Perguntas e Respostas'
    ],
    gallery: [],
    palette: ['#059669', '#3B82F6'],
    borderRadius: 'squared',
    fontClass: 'font-outfit',
    subscribe: 'https://example.com/encontro-otimizacao-2026',
    themeMode: 'light',
  };

  await prisma.event.upsert({
    where: { slug: 'encontro-liao-otimizacao-escala-2026' },
    update: {
      ...futureEvent4Data,
      partners: { set: [{ id: partner3.id }] }
    },
    create: {
      ...futureEvent4Data,
      slug: 'encontro-liao-otimizacao-escala-2026',
      agenda: {
        create: [
          { time: '15:00', title: 'Abertura e Apresentação de Pesquisas', description: 'Projetos em andamento no LIAO' },
          { time: '16:00', title: 'Mesa Redonda: Meta-heurísticas na Indústria', description: 'Debate com convidados' }
        ]
      },
      speakers: {
        create: [
          {
            memberId: member2.id,
            role: 'Pesquisador em Otimização',
            link: 'https://github.com/bruno'
          }
        ]
      },
      partners: { connect: [{ id: partner3.id }] }
    }
  });

  console.log('✅ Seed finished! Events created (past and future successfully added).');

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
