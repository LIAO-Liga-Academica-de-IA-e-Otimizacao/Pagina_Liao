import React from 'react';
import { Link } from 'react-router-dom';
import { 
    IoArrowBack as ArrowLeft,
    IoCalendarOutline as Calendar,
    IoLocationOutline as MapPin,
    IoSparkles as Sparkles,
    IoRocketOutline as Rocket
} from 'react-icons/io5';
import type { EventApi } from '../../models/Event';
import FadeInSection from './FadeInSection';

interface EventHeroProps {
    event: EventApi;
    eventDate: string;
}

const EventHero: React.FC<EventHeroProps> = ({ event, eventDate }) => {
    return (
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

                    {(event as any).subscribe && (
                        <div className="pt-4">
                            <a 
                                href={(event as any).subscribe} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
                                style={{ 
                                    background: `linear-gradient(135deg, rgb(var(--event-primary-rgb)), rgb(var(--event-secondary-rgb)))`,
                                    borderRadius: 'var(--event-radius)',
                                    boxShadow: `0 10px 30px -10px rgb(var(--event-primary-rgb) / 0.5)`
                                }}
                            >
                                <Rocket size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                Realizar Inscrição
                            </a>
                        </div>
                    )}
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
    );
};

export default EventHero;

