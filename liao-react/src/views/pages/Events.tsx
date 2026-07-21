import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import type { EventApi } from '../../models/Event';
import PageLayout from '../layouts/PageLayout';
import EventSectionHeader from '../../components/domain/EventSectionHeader';
import EventGrid from '../../components/domain/EventGrid';
import FilterTabs from '../../components/ui/FilterTabs';
import { 
    IoCalendarOutline as CalendarIcon, 
    IoCheckmarkCircleOutline as CheckmarkIcon,
    IoSparklesOutline as SparklesIcon,
    IoGridOutline as GridIcon,
    IoTimeOutline as TimeIcon
} from 'react-icons/io5';

const FALLBACK_EVENTS: EventApi[] = [
    {
        id: 101,
        title: 'Hackathon LIAO 2026: IA & Otimização Combinatória',
        slug: 'hackathon-liao-2026',
        description: '36 horas de maratona intensiva para criar soluções baseadas em Inteligência Artificial e Otimização para problemas do setor produtivo e social.',
        coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1470&auto=format&fit=crop',
        date: '2026-09-12T08:00:00Z',
        location: 'Auditório Principal & Hub de Inovação - UFBA',
        highlights: ['Maratona Prática de 36h', 'Premiação para Equipes', 'Mentoria com Especialistas'],
        gallery: [],
        palette: ['#2563EB', '#7C3AED'],
        borderRadius: 'round',
        themeMode: 'dark',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        agenda: [],
        speakers: [],
        partners: []
    },
    {
        id: 102,
        title: 'Semana da Inteligência Artificial e Otimização 2026',
        slug: 'semana-da-ia-e-otimizacao-2026',
        description: 'Edição 2026 da nossa semana acadêmica com palestras internacionais, workshops de ponta e apresentação de pesquisas inovadoras.',
        coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc596e?q=80&w=1470&auto=format&fit=crop',
        date: '2026-10-20T09:00:00Z',
        location: 'Centro de Convenções UFBA - PAF I',
        highlights: ['Palestras Internacionais', 'Minicursos Práticos', 'Pôsteres Acadêmicos'],
        gallery: [],
        palette: ['#0D9488', '#0284C7'],
        borderRadius: 'round',
        themeMode: 'light',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        agenda: [],
        speakers: [],
        partners: []
    },
    {
        id: 103,
        title: 'Simpósio de Otimização e Sustentabilidade',
        slug: 'simposio-otimizacao-sustentabilidade-2026',
        description: 'Um encontro aberto para discutir a aplicação de algoritmos de otimização no desenvolvimento de soluções sustentáveis e ecológicas.',
        coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1470&auto=format&fit=crop',
        date: '2026-06-15T09:00:00Z',
        location: 'Auditório 2 - Pavilhão de Aulas do IC',
        highlights: ['Modelagem Verde', 'Smart Grids', 'Logística Reversa'],
        gallery: [],
        palette: ['#059669', '#0d9488'],
        borderRadius: 'round',
        themeMode: 'light',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        agenda: [],
        speakers: [],
        partners: []
    },
    {
        id: 104,
        title: 'Workshop IA Avançada: Do Zero ao Deploy',
        slug: 'workshop-ia-avancada-2026',
        description: 'Um evento imersivo focado em construção de LLMs e deploy escalável em nuvem com Kubernetes.',
        coverImage: 'https://images.unsplash.com/photo-1745674684463-62f62cb88d4c?q=80&w=1470&auto=format&fit=crop',
        date: '2026-05-20T14:00:00Z',
        location: 'Auditório Magno - Instituto de Computação',
        highlights: ['Transformers', 'Fine-tuning LoRA', 'Deploy K8s'],
        gallery: [],
        palette: ['#4F46E5', '#761515'],
        borderRadius: 'squared',
        themeMode: 'dark',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        agenda: [],
        speakers: [],
        partners: []
    },
    {
        id: 105,
        title: 'Minicurso: Introdução ao Python para Ciência de Dados',
        slug: 'minicurso-python-dados-2026',
        description: 'Minicurso prático introdutório cobrindo manipulação de dados com Pandas e NumPy e introdução a modelos preditivos.',
        coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1470&auto=format&fit=crop',
        date: '2026-03-10T14:00:00Z',
        location: 'Laboratório de Informática 3 - IC UFBA',
        highlights: ['Python Básico', 'Pandas & Numpy', 'Casos Práticos'],
        gallery: [],
        palette: ['#D97706', '#B45309'],
        borderRadius: 'squared',
        themeMode: 'light',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        agenda: [],
        speakers: [],
        partners: []
    }
];

type FilterTab = 'all' | 'upcoming' | 'finished';

const Events: React.FC = () => {
    const [events, setEvents] = useState<EventApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterTab>('all');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await apiService.getEvents() as any;
                if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
                    setEvents(response.data);
                } else {
                    setEvents(FALLBACK_EVENTS);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
                setEvents(FALLBACK_EVENTS);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const now = new Date();

    // Categorize events by date
    const upcomingEvents = events
        .filter(event => new Date(event.date as string) >= now)
        .sort((a, b) => new Date(a.date as string).getTime() - new Date(b.date as string).getTime());

    const finishedEvents = events
        .filter(event => new Date(event.date as string) < now)
        .sort((a, b) => new Date(b.date as string).getTime() - new Date(a.date as string).getTime());

    const showUpcomingSection = filter === 'all' || filter === 'upcoming';
    const showFinishedSection = filter === 'all' || filter === 'finished';

    return (
        <PageLayout
            title="Eventos LIAO"
            subtitle="Fique por dentro das nossas palestras, workshops, maratonas e encontros sobre inteligência artificial e otimização."
        >
            <div className="pb-24">
                {/* Standardized Filter Navigation Tabs */}
                <FilterTabs
                    tabs={[
                        { id: 'all', label: 'Todos os Eventos', icon: <GridIcon size={18} />, count: events.length },
                        { id: 'upcoming', label: 'Próximos Eventos', icon: <CalendarIcon size={18} />, count: upcomingEvents.length },
                        { id: 'finished', label: 'Eventos Realizados', icon: <CheckmarkIcon size={18} />, count: finishedEvents.length }
                    ]}
                    activeTab={filter}
                    onChange={setFilter}
                    className="mb-12"
                />

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="space-y-20">
                        {/* SESSION 1: PRÓXIMOS EVENTOS */}
                        {showUpcomingSection && (
                            <section className="space-y-8">
                                <EventSectionHeader 
                                    title="Próximos Eventos"
                                    subtitle="Participe das nossas próximas maratonas, palestras e workshops presenciais e online."
                                    count={upcomingEvents.length}
                                    countSingularLabel="agendado"
                                    countPluralLabel="agendados"
                                    type="upcoming"
                                    icon={<SparklesIcon size={22} className="animate-pulse" />}
                                />

                                <EventGrid 
                                    events={upcomingEvents}
                                    emptyState={{
                                        variant: 'emerald',
                                        icon: <TimeIcon className="w-12 h-12 text-emerald-400 dark:text-emerald-600" />,
                                        title: "Nenhum evento futuro agendado no momento",
                                        description: "Estamos preparando novas edições incríveis. Fique atento às nossas redes!"
                                    }}
                                />
                            </section>
                        )}

                        {/* SESSION 2: EVENTOS REALIZADOS */}
                        {showFinishedSection && (
                            <section className="space-y-8">
                                <EventSectionHeader 
                                    title="Eventos Realizados"
                                    subtitle="Reviva os momentos, agendas, palestras e materiais dos nossos eventos anteriores."
                                    count={finishedEvents.length}
                                    countSingularLabel="concluído"
                                    countPluralLabel="concluídos"
                                    type="finished"
                                    icon={<CheckmarkIcon size={22} />}
                                />

                                <EventGrid 
                                    events={finishedEvents}
                                    emptyState={{
                                        variant: 'neutral',
                                        icon: <CheckmarkIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-600" />,
                                        title: "Nenhum evento anterior encontrado",
                                        description: "Os eventos finalizados serão listados aqui."
                                    }}
                                />
                            </section>
                        )}
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default Events;
