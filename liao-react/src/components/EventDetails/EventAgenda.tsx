import React from 'react';
import { IoTimeOutline as Clock, IoPersonOutline as User } from 'react-icons/io5';
import type { AgendaItem } from '../../models/Event';
import FadeInSection from './FadeInSection';

interface EventAgendaProps {
    agenda: AgendaItem[];
    palette: string[];
}

const EventAgenda: React.FC<EventAgendaProps> = ({ agenda, palette }) => {
    return (
        <FadeInSection delay="delay-200">
            <div className="space-y-8">
                <h3 className="text-3xl font-bold tracking-tight text-white mb-8">Agenda do Evento</h3>
                <div className="space-y-6">
                    {agenda.map((item, idx) => {
                        const itemColor = palette[idx % palette.length];
                        
                        return (
                            <div key={idx} className="relative pl-8 group">
                                <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10 group-last:bottom-auto group-last:h-full"></div>
                                <div 
                                    className="absolute left-[-4px] top-2 w-2 h-2 rounded-full ring-4 ring-neutral-950"
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
                                                <p className="text-neutral-400 text-sm mt-1">{item.description}</p>
                                            )}
                                        </div>
                                        {item.speakerName && (
                                            <div className="flex items-center gap-2 bg-neutral-900 px-4 py-2 rounded-xl border border-white/5 shrink-0">
                                                <User size={14} className="text-neutral-500" />
                                                <span className="text-sm font-medium text-neutral-300">{item.speakerName}</span>
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
    );
};

export default EventAgenda;
