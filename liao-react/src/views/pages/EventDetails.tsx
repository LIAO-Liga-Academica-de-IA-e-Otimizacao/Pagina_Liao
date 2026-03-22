import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    IoArrowBack as ArrowLeft,
    IoCalendarOutline as Calendar,
    IoLocationOutline as MapPin,
    IoSparkles as Sparkles,
    IoPersonOutline as User,
    IoArrowForward as ArrowRight,
    IoOpenOutline as ExternalLink,
    IoTimeOutline as Clock,
    IoNotificationsOutline as Bell
} from 'react-icons/io5';
import { apiService } from '../../services/api';
import type { EventApi } from '../../models/Event';

const FadeInSection: React.FC<{ children: React.ReactNode; delay?: string }> = ({ children, delay = 'delay-0' }) => {
    const [isVisible, setVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            });
        });
        if (domRef.current) observer.observe(domRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={domRef}
            className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${delay}`}
        >
            {children}
        </div>
    );
};

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
    // Remove # if present
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

    const palette = event.palette && event.palette.length > 0 
        ? event.palette 
        : ['#6366f1', '#a855f7', '#ec4899'];
    
    const primaryColor = palette[0];
    const secondaryColor = palette[1] || primaryColor;
    const tertiaryColor = palette[2] || secondaryColor;

    const borderRadiusValue = event.borderRadius === 'squared' ? '0px' : '1.5rem';
    const borderRadiusLarge = event.borderRadius === 'squared' ? '0px' : '2rem';
    const borderRadiusSmall = event.borderRadius === 'squared' ? '0px' : '0.75rem';

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

    // Helper for event speakers to safely access their Member properties
    const speakersList = event.speakers || [];

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
                {/* Header */}
                <FadeInSection>
                    <Link to="/events" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-12 group transition-colors">
                        <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="font-medium tracking-wide text-sm">Voltar para eventos</span>
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                        <div className="space-y-8">
                            <div 
                                className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 border"
                                style={{ 
                                    backgroundColor: `rgb(var(--event-primary-rgb) / 0.2)`, 
                                    color: `rgb(var(--event-primary-rgb) / 1)`, 
                                    borderColor: `rgb(var(--event-primary-rgb) / 0.3)` 
                                }}
                            >
                                <Sparkles size={14} />
                                <span>Evento Exclusivo</span>
                            </div>
                            
                            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60">
                                {event.title}
                            </h1>
                            
                            <p className="text-xl text-zinc-400 leading-relaxed font-light max-w-xl">
                                {event.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10">
                                <div className="flex items-center gap-3 text-zinc-300">
                                    <div 
                                        className="p-3"
                                        style={{ 
                                            backgroundColor: `rgb(var(--event-primary-rgb) / 0.1)`, 
                                            color: `rgb(var(--event-primary-rgb) / 1)`,
                                            borderRadius: 'var(--event-radius-sm)'
                                        }}
                                    >
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-0.5">Data</p>
                                        <p className="font-medium text-white">{eventDate}</p>
                                    </div>
                                </div>
                                <div className="w-px h-12 bg-white/10 hidden sm:block"></div>
                                <div className="flex items-center gap-3 text-zinc-300">
                                    <div 
                                        className="p-3"
                                        style={{ 
                                            backgroundColor: `rgb(var(--event-secondary-rgb) / 0.1)`, 
                                            color: `rgb(var(--event-secondary-rgb) / 1)`,
                                            borderRadius: 'var(--event-radius-sm)'
                                        }}
                                    >
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-0.5">Local</p>
                                        <p className="font-medium text-white">{event.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div 
                            className="relative lg:h-[600px] overflow-hidden group border border-white/10 shadow-2xl shadow-[var(--event-primary)]/5"
                            style={{ borderRadius: 'var(--event-radius-lg)' }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10"></div>
                            <img 
                                src={event.coverImage || ''} 
                                alt={event.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    </div>
                </FadeInSection>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-16">
                        {/* Highlights */}
                        {event.highlights && event.highlights.length > 0 && (
                            <FadeInSection delay="delay-100">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                                        <h3 className="text-2xl font-bold tracking-tight text-white px-4">O que esperar</h3>
                                        <div className="h-px flex-1 bg-gradient-to-l from-white/20 to-transparent"></div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {event.highlights.map((highlight, idx) => (
                                            <div 
                                                key={idx} 
                                                className="flex items-start gap-4 p-5 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors"
                                                style={{ borderRadius: 'var(--event-radius)' }}
                                            >
                                                <div 
                                                    className="p-2 mt-1 flex-shrink-0"
                                                    style={{ 
                                                        backgroundColor: `rgb(var(--event-primary-rgb) / 0.2)`, 
                                                        color: `rgb(var(--event-primary-rgb) / 1)`,
                                                        borderRadius: 'var(--event-radius-sm)'
                                                    }}
                                                >
                                                    <Sparkles size={16} />
                                                </div>
                                                <p className="text-zinc-300 leading-relaxed">{highlight}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </FadeInSection>
                        )}

                        {/* Agenda */}
                        {event.agenda && event.agenda.length > 0 && (
                            <FadeInSection delay="delay-200">
                                <div className="space-y-8">
                                    <h3 className="text-3xl font-bold tracking-tight text-white mb-8">Agenda do Evento</h3>
                                    <div className="space-y-6">
                                        {event.agenda.map((item, idx) => {
                                            const itemColor = palette[idx % palette.length];
                                            const itemColorRgb = hexToRgb(itemColor);
                                            
                                            return (
                                                <div key={idx} className="relative pl-8 group">
                                                    <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10 group-last:bottom-auto group-last:h-full"></div>
                                                    <div 
                                                        className="absolute left-[-4px] top-2 w-2 h-2 rounded-full ring-4 ring-zinc-950"
                                                        style={{ backgroundColor: itemColor }}
                                                    ></div>
                                                    <div 
                                                        className="bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors"
                                                        style={{ borderRadius: 'var(--event-radius)' }}
                                                    >
                                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                            <div>
                                                                <div 
                                                                    className="flex items-center gap-2 mb-2 font-mono text-sm"
                                                                    style={{ color: itemColor }}
                                                                >
                                                                    <Clock size={16} />
                                                                    {item.time}
                                                                </div>
                                                                <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                                                {item.description && (
                                                                    <p className="text-zinc-400 text-sm mt-1">{item.description}</p>
                                                                )}
                                                            </div>
                                                            {item.speakerName && (
                                                                <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-xl border border-white/5 shrink-0">
                                                                    <User size={14} className="text-zinc-500" />
                                                                    <span className="text-sm font-medium text-zinc-300">{item.speakerName}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </FadeInSection>
                        )}

                        {/* Gallery */}
                        {event.gallery && event.gallery.length > 0 && (
                            <FadeInSection delay="delay-300">
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-bold tracking-tight text-white mb-6">Galeria</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {event.gallery.map((img, i) => (
                                            <div 
                                                key={i} 
                                                className="aspect-square overflow-hidden border border-white/10 group cursor-pointer bg-white/5"
                                                style={{ borderRadius: 'var(--event-radius)' }}
                                            >
                                                <img 
                                                    src={img} 
                                                    alt={`Gallery ${i}`} 
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </FadeInSection>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Speakers */}
                        {speakersList.length > 0 && (
                            <FadeInSection delay="delay-400">
                                <div 
                                    className="bg-white/5 border border-white/10 p-8 backdrop-blur-md"
                                    style={{ borderRadius: 'var(--event-radius-lg)' }}
                                >
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                        <User 
                                            size={24} 
                                            style={{ color: `rgb(var(--event-primary-rgb) / 1)` }} 
                                        />
                                        Palestrantes
                                    </h3>
                                    <div className="space-y-4">
                                        {speakersList.map((speaker, i) => {
                                            const speakerName = speaker.member?.name || speaker.name || 'Palestrante';
                                            const speakerRole = speaker.member?.role || speaker.role || '';
                                            const speakerPhoto = speaker.member?.photo || speaker.photo || '';
                                            const speakerColor = palette[i % palette.length];
                                            
                                            return (
                                                <div 
                                                    key={i} 
                                                    onClick={() => {
                                                        if (speaker.member) {
                                                            window.open(`/members`, '_blank'); // Go to specific member in the future
                                                        } else if (speaker.link) {
                                                            window.open(speaker.link, '_blank', 'noopener,noreferrer');
                                                        }
                                                    }}
                                                    className={`group flex items-center gap-4 p-4 border transition-all ${
                                                        speaker.member || speaker.link 
                                                            ? 'cursor-pointer hover:bg-white/10 border-white/5 hover:border-white/20' 
                                                            : 'border-transparent bg-white/5'
                                                    }`}
                                                    style={{ 
                                                        '--hover-border': `rgb(${hexToRgb(speakerColor)} / 0.5)`,
                                                        borderRadius: 'var(--event-radius)'
                                                    } as any}
                                                >
                                                    <div className="relative">
                                                        <div 
                                                            className="w-14 h-14 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700/50 transition-colors group-hover:border-[var(--hover-border)]"
                                                        >
                                                            {speakerPhoto ? (
                                                                <img src={speakerPhoto} alt={speakerName} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-zinc-500">
                                                                    {speakerName.charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {speaker.member && (
                                                            <div 
                                                                className="absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-zinc-900"
                                                                style={{ backgroundColor: speakerColor }}
                                                            >
                                                                <Sparkles size={10} className="text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-bold text-white truncate">{speakerName}</h4>
                                                            {speaker.member && (
                                                                <span 
                                                                    className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
                                                                    style={{ 
                                                                        backgroundColor: `rgb(${hexToRgb(speakerColor)} / 0.3)`,
                                                                        color: `rgb(${hexToRgb(speakerColor)} / 1)`
                                                                    }}
                                                                >
                                                                    Membro
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-zinc-400 truncate">{speakerRole}</p>
                                                        {speaker.company && (
                                                            <p className="text-xs text-zinc-500 font-medium mt-0.5">{speaker.company}</p>
                                                        )}
                                                    </div>
                                                    {(speaker.member || speaker.link) && (
                                                        <div className="text-zinc-600 group-hover:text-white transition-colors">
                                                            {speaker.member ? <ArrowRight size={16} /> : <ExternalLink size={16} />}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </FadeInSection>
                        )}

                        {/* CTA Card */}
                        <FadeInSection delay="delay-500">
                            <div 
                                className="relative overflow-hidden p-8 border border-white/10 shadow-2xl"
                                style={{ borderRadius: 'var(--event-radius-lg)' }}
                            >
                                <div 
                                    className="absolute inset-0 backdrop-blur-xl"
                                    style={{ 
                                        background: `linear-gradient(to bottom right, rgb(var(--event-primary-rgb) / 0.2), rgb(var(--event-secondary-rgb) / 0.2))` 
                                    }}
                                ></div>
                                <div className="relative z-10 text-center space-y-6">
                                    <div 
                                        className="w-16 h-16 mx-auto bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20"
                                        style={{ borderRadius: 'var(--event-radius)' }}
                                    >
                                        <Bell size={28} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Não perca!</h3>
                                        <p className="text-zinc-300 text-sm leading-relaxed">
                                            Adicione este evento à sua agenda e fique por dentro de todas as novidades.
                                        </p>
                                    </div>
                                    <button 
                                        className="w-full py-4 bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10 active:scale-[0.98] transition-all"
                                        style={{ borderRadius: 'var(--event-radius-sm)' }}
                                    >
                                        Notificar-me
                                    </button>
                                </div>
                            </div>
                        </FadeInSection>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;