import React from 'react';
import { IoStatsChartOutline as StatsIcon, IoSparkles as SparklesIcon } from 'react-icons/io5';
import FadeInSection from './FadeInSection';

export interface EventStat {
    id: string;
    value: string;
    label: string;
}

interface EventStatsProps {
    stats: EventStat[];
}

const EventStats: React.FC<EventStatsProps> = ({ stats }) => {
    if (!stats || stats.length === 0) return null;

    return (
        <FadeInSection delay="delay-150">
            <div className="my-12 p-8 md:p-10 rounded-3xl bg-neutral-200/50 dark:bg-white/[0.02] border border-neutral-300/70 dark:border-white/10 relative overflow-hidden backdrop-blur-xl shadow-lg">
                {/* Background glow accent */}
                <div 
                    className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none"
                    style={{ backgroundColor: 'var(--event-primary)' }}
                ></div>
                <div 
                    className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none"
                    style={{ backgroundColor: 'var(--event-secondary)' }}
                ></div>

                {/* Section Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div 
                        className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-inner"
                        style={{ 
                            backgroundColor: 'rgb(var(--event-primary-rgb) / 0.12)', 
                            borderColor: 'rgb(var(--event-primary-rgb) / 0.3)',
                            color: 'var(--event-primary)' 
                        }}
                    >
                        <StatsIcon size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white leading-tight">O Evento em Números</h3>
                        <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Resultados e impacto alcançados nesta edição</p>
                    </div>
                </div>

                {/* Modular Stats Grid */}
                <div className={`grid grid-cols-2 ${stats.length >= 4 ? 'lg:grid-cols-4' : stats.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 md:gap-6`}>
                    {stats.map((stat, idx) => (
                        <div 
                            key={stat.id || idx}
                            className="group relative p-6 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200/90 dark:border-white/5 hover:border-[var(--event-primary)]/40 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1"
                        >
                            {/* Hover highlight */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--event-primary)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                            <div className="relative z-10 space-y-1">
                                <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-700 dark:from-white dark:via-white dark:to-neutral-300 group-hover:from-[var(--event-primary)] group-hover:to-[var(--event-secondary)] transition-all duration-500">
                                    {stat.value}
                                </div>
                                <div className="text-xs md:text-sm font-semibold text-neutral-600 dark:text-neutral-300 leading-snug">
                                    {stat.label}
                                </div>
                            </div>

                            <div className="relative z-10 pt-4 flex items-center justify-end">
                                <SparklesIcon size={14} className="text-neutral-400 dark:text-neutral-600 group-hover:text-[var(--event-primary)] transition-colors duration-300" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </FadeInSection>
    );
};

export default EventStats;
