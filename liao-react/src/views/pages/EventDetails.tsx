import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { IoArrowBack as ArrowLeft, IoCalendarOutline as Calendar, IoSparkles as Sparkles } from 'react-icons/io5';
import { apiService } from '../../services/api';
import type { EventApi } from '../../models/Event';

// Sub-components
import EventHero from '../../components/EventDetails/EventHero';
import EventHighlights from '../../components/EventDetails/EventHighlights';
import EventAgenda from '../../components/EventDetails/EventAgenda';
import EventGallery from '../../components/EventDetails/EventGallery';
import EventSpeakers from '../../components/EventDetails/EventSpeakers';
import EventCTA from '../../components/EventDetails/EventCTA';
import EventPartners from '../../components/EventDetails/EventPartners';
import ScheduleModal from '../../components/EventDetails/ScheduleModal';
import FadeInSection from '../../components/EventDetails/FadeInSection';
import type { EventContentState } from '../../components/forms/EventContentManager';
import ReactMarkdown from 'react-markdown';

const FONT_MAP: Record<string, { family: string; url: string }> = {
    'font-serif': { 
        family: "'Playfair Display', serif", 
        url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap' 
    },
    'font-mono': { 
        family: "'JetBrains Mono', monospace", 
        url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap' 
    },
    'font-space': {
        family: "'Space Grotesk', sans-serif",
        url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
    },
    'font-outfit': {
        family: "'Outfit', sans-serif",
        url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap'
    },
    'font-clash': {
        family: "'Clash Display', sans-serif",
        url: 'https://fonts.cdnfonts.com/css/clash-display'
    }
};

const hexToRgb = (hex: string) => {
    let r = 0, g = 0, b = 0;
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
    }
    return `${r} ${g} ${b}`;
};

const EventDetails: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [event, setEvent] = useState<EventApi | null>(null);
    const [loading, setLoading] = useState(true);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    // Parsing structured description
    let parsedContent: EventContentState | null = null;
    let descriptionText = event?.description || '';

    try {
        if (event?.description && (event.description.startsWith('{') || event.description.startsWith('['))) {
            parsedContent = JSON.parse(event.description);
            descriptionText = parsedContent?.presentation?.content || event.description;
        }
    } catch (e) {
        // Not JSON, keep as is
    }

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                if (!slug) return;
                const response = await apiService.getEventBySlug(slug) as any;
                setEvent(response.data as EventApi);
            } catch (error) {
                console.error("Error fetching event details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [slug]);

    useEffect(() => {
        if (event?.fontClass && FONT_MAP[event.fontClass]) {
            const fontInfo = FONT_MAP[event.fontClass];
            const link = document.createElement('link');
            link.href = fontInfo.url;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
            return () => {
                document.head.removeChild(link);
            };
        }
    }, [event?.fontClass]);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
                    <div className="absolute inset-0 bg-white/5 blur-xl rounded-full"></div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-400">
                <Calendar size={48} className="mb-4 opacity-50" />
                <h2 className="text-2xl font-bold text-white mb-2">Evento não encontrado</h2>
                <Link to="/events" className="text-neutral-400 hover:text-white flex items-center gap-2">
                    <ArrowLeft size={20} /> Voltar para eventos
                </Link>
            </div>
        );
    }

    const eventDate = new Date(event.date as string).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const fontClass = event.fontClass || 'font-sans';
    const fontFamily = event.fontClass && FONT_MAP[event.fontClass] 
        ? FONT_MAP[event.fontClass].family 
        : 'inherit';

    const palette = (event as any).palette && (event as any).palette.length > 0 
        ? (event as any).palette 
        : ['#6366f1', '#a855f7', '#ec4899'];
    
    const primaryColor = palette[0];
    const secondaryColor = palette[1] || primaryColor;
    const tertiaryColor = palette[2] || secondaryColor;

    const borderRadiusValue = (event as any).borderRadius === 'squared' ? '0px' : '1.5rem';
    const borderRadiusLarge = (event as any).borderRadius === 'squared' ? '0px' : '2rem';
    const borderRadiusSmall = (event as any).borderRadius === 'squared' ? '0px' : '0.75rem';

    const styleVariables = {
        '--event-primary': primaryColor,
        '--event-secondary': secondaryColor,
        '--event-tertiary': tertiaryColor,
        '--event-primary-rgb': hexToRgb(primaryColor),
        '--event-secondary-rgb': hexToRgb(secondaryColor),
        '--event-tertiary-rgb': hexToRgb(tertiaryColor),
        '--event-radius': borderRadiusValue,
        '--event-radius-lg': borderRadiusLarge,
        '--event-radius-sm': borderRadiusSmall,
        'fontFamily': fontFamily,
    } as React.CSSProperties;

    const renderContentSection = (title: string, content: string | undefined, isPlus: boolean = false, delay: string = 'delay-0') => {
        if (!content) return null;
        
        return (
            <FadeInSection delay={delay}>
                <div 
                    className={`relative group p-4 md:p-8 rounded-3xl transition-colors ${
                        isPlus 
                            ? 'bg-neutral-900/40 border-l-4 shadow-sm my-12' 
                            : 'bg-transparent my-10'
                    }`}
                    style={isPlus ? { borderLeftColor: 'var(--event-primary)' } : {}}
                >
                    {!isPlus && <div className="absolute -inset-x-6 -inset-y-4 bg-white/0 group-hover:bg-white/[0.02] transition-colors rounded-3xl -z-10"></div>}
                    
                    <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-4">
                        <div 
                            className={`flex items-center justify-center rounded-2xl ${
                                isPlus 
                                    ? 'w-12 h-12 bg-primary-500/20 border border-primary-500/30' 
                                    : 'w-10 h-10 bg-primary-500/10 border border-primary-500/20 shadow-inner'
                            }`}
                            style={{ color: 'var(--event-primary)' }}
                        >
                            <Sparkles size={isPlus ? 24 : 20} className={isPlus ? "animate-pulse" : ""} />
                        </div>
                        {title}
                    </h3>
                    
                    {/* Markdown rendering with Prose styling mimicking native App typography.  */}
                    <div 
                        className="prose prose-invert prose-lg md:prose-xl max-w-none 
                                    prose-headings:text-white prose-headings:font-bold 
                                    prose-p:text-neutral-400 prose-p:leading-relaxed 
                                    prose-a:text-[color:var(--event-primary)] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                                    prose-strong:text-white 
                                    prose-ul:list-disc prose-ol:list-decimal
                                    prose-li:text-neutral-400 prose-li:marker:text-[color:var(--event-primary)]"
                    >
                        <ReactMarkdown>
                            {content}
                        </ReactMarkdown>
                    </div>
                </div>
            </FadeInSection>
        );
    };

    return (
        <div 
            className={`relative min-h-screen bg-neutral-950 text-neutral-50 overflow-x-hidden ${fontClass}`}
            style={styleVariables}
        >
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div 
                    className="absolute top-0 left-1/4 w-[1000px] h-[1000px] rounded-full blur-[120px] mix-blend-screen opacity-50"
                    style={{ backgroundColor: `rgb(var(--event-primary-rgb) / 0.1)` }}
                ></div>
                <div 
                    className="absolute bottom-0 right-1/4 w-[800px] h-[800px] rounded-full blur-[120px] mix-blend-screen opacity-50"
                    style={{ backgroundColor: `rgb(var(--event-secondary-rgb) / 0.1)` }}
                ></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/bg-grid.svg')] opacity-[0.02]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
                <EventHero 
                    event={event} 
                    eventDate={eventDate} 
                    descriptionOverride={descriptionText}
                    hasSchedule={!!parsedContent?.scheduleTable?.enabled}
                    onOpenSchedule={() => setIsScheduleOpen(true)}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-16 pb-24">
                        <div className="space-y-4">
                            {parsedContent?.objectives?.enabled && renderContentSection('Objetivos', parsedContent.objectives.content, false, '')}
                            {parsedContent?.targetAudience?.enabled && renderContentSection('Público-alvo', parsedContent.targetAudience.content, false, 'delay-150')}
                            {parsedContent?.structure?.enabled && renderContentSection('Estrutura Geral', parsedContent.structure.content, false, 'delay-300')}
                        </div>

                        {event.highlights && (
                            <div className="pt-8 border-t border-white/5">
                                <EventHighlights highlights={event.highlights} />
                            </div>
                        )}
                        
                        {event.agenda && event.agenda.length > 0 && (
                            <div className="pt-8 border-t border-white/5">
                                <EventAgenda agenda={event.agenda} palette={palette} />
                            </div>
                        )}
                        
                        {parsedContent?.schedule?.enabled && (
                            <div className="pt-8 border-t border-white/5">
                                {renderContentSection('Cronograma', parsedContent.schedule.content, false, '')}
                            </div>
                        )}
                        
                        {parsedContent?.dynamicSections?.filter(s => (s as any).enabled !== false).map((section, idx) => {
                            const delayClass = ['delay-100', 'delay-200', 'delay-300', 'delay-500', 'delay-700'][idx % 5];
                            return (
                                <React.Fragment key={section.id}>
                                    {renderContentSection(section.title, section.content, true, delayClass)}
                                </React.Fragment>
                            );
                        })}
                        
                        {parsedContent?.finalConsiderations?.enabled && renderContentSection('Considerações Finais', parsedContent.finalConsiderations.content, false, '')}

                        {event.gallery && <EventGallery gallery={event.gallery} />}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <EventSpeakers speakers={event.speakers} palette={palette} />
                        <EventCTA event={event} />
                    </div>
                </div>

                {/* Partners Section */}
                {event.partners && event.partners.length > 0 && (
                    <div className="mt-16">
                        <EventPartners partners={event.partners} />
                    </div>
                )}
            </div>

            {parsedContent?.scheduleTable && (
                <ScheduleModal 
                    isOpen={isScheduleOpen}
                    onClose={() => setIsScheduleOpen(false)}
                    schedule={parsedContent.scheduleTable}
                    eventTitle={event.title}
                    palette={palette}
                />
            )}
        </div>
    );
};

export default EventDetails;
