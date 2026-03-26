import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { IoArrowBack as ArrowLeft, IoCalendarOutline as Calendar } from 'react-icons/io5';
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
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
                    <div className="absolute inset-0 bg-white/5 blur-xl rounded-full"></div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
                <Calendar size={48} className="mb-4 opacity-50" />
                <h2 className="text-2xl font-bold text-white mb-2">Evento não encontrado</h2>
                <Link to="/events" className="text-zinc-400 hover:text-white flex items-center gap-2">
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

    return (
        <div 
            className={`relative min-h-screen bg-zinc-950 text-zinc-50 overflow-x-hidden ${fontClass}`}
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
                <EventHero event={event} eventDate={eventDate} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-16">
                        {event.highlights && <EventHighlights highlights={event.highlights} />}
                        {event.agenda && <EventAgenda agenda={event.agenda} palette={palette} />}
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
        </div>
    );
};

export default EventDetails;
