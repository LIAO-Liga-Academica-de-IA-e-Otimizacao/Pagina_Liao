import React from 'react';
import { Link } from 'react-router-dom';
import { 
    IoArrowBack as ArrowLeft,
    IoCalendarOutline as Calendar,
    IoLocationOutline as MapPin,
    IoSparkles as Sparkles,
    IoRocketOutline as Rocket,
    IoChevronForward
} from 'react-icons/io5';
import type { EventApi } from '../../models/Event';
import FadeInSection from './FadeInSection';

interface EventHeroProps {
    event: EventApi;
    eventDate: string;
    descriptionOverride?: string;
    hasSchedule?: boolean;
    onOpenSchedule?: () => void;
}

const EventHero: React.FC<EventHeroProps> = ({ 
    event, 
    eventDate, 
    descriptionOverride, 
    hasSchedule, 
    onOpenSchedule 
}) => {
    return (
        <FadeInSection>
            <Link to="/events" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white mb-12 group transition-colors">
                <div className="p-2 bg-neutral-200/50 dark:bg-white/5 rounded-full group-hover:bg-neutral-200 dark:group-hover:bg-white/10 transition-colors">
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
                    
                    <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-700 dark:from-white dark:via-white dark:to-white/60">
                        {event.title}
                    </h1>
                    
                    <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed font-light max-w-xl">
                        {descriptionOverride || event.description}
                    </p>

                    {hasSchedule && (
                        <div className="pt-2">
                            <button
                                onClick={onOpenSchedule}
                                className="group flex items-center gap-3 px-6 py-3 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 rounded-2xl transition-all hover:bg-neutral-200/50 dark:hover:bg-white/10 overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                <div 
                                    className="p-2 rounded-lg bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20 transition-colors"
                                    style={{ color: 'var(--event-primary)' }}
                                >
                                    <Calendar size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Visualizar</p>
                                    <p className="font-bold text-neutral-900 dark:text-white flex items-center gap-1">
                                        Cronograma Completo
                                        <IoChevronForward className="group-hover:translate-x-1 transition-transform" />
                                    </p>
                                </div>
                            </button>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-neutral-200 dark:border-white/10">
                        <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
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
                                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-0.5">Data</p>
                                <p className="font-medium text-neutral-900 dark:text-white">{eventDate}</p>
                            </div>
                        </div>
                        <div className="w-px h-12 bg-neutral-200 dark:bg-white/10 hidden sm:block"></div>
                        <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
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
                                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-0.5">Local</p>
                                <p className="font-medium text-neutral-900 dark:text-white">
                                    {event.location ? event.location.split('|').map((loc, i) => (
                                        <span key={i} className="block">{loc.trim()}</span>
                                    )) : 'A definir'}
                                </p>
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
                    className="relative lg:h-[600px] overflow-hidden group border border-neutral-200 dark:border-white/10 shadow-2xl shadow-[var(--event-primary)]/5"
                    style={{ borderRadius: 'var(--event-radius-lg)' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-200/50 dark:from-neutral-950/80 via-transparent z-10"></div>
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

