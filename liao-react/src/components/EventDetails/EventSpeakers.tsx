import React from 'react';
import { 
    IoPersonOutline as User, 
    IoArrowForward as ArrowRight,
    IoOpenOutline as ExternalLink,
    IoSparkles as Sparkles
} from 'react-icons/io5';
import type { EventSpeaker, Member } from '../../models/Event';
import FadeInSection from './FadeInSection';

interface EventSpeakersProps {
    speakers: (EventSpeaker & { member?: Member | null })[];
    palette: string[];
}

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

const EventSpeakers: React.FC<EventSpeakersProps> = ({ speakers, palette }) => {
    if (!speakers || speakers.length === 0) return null;

    return (
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
                    {speakers.map((speaker, i) => {
                        const speakerName = speaker.member?.name || speaker.name || 'Palestrante';
                        const speakerRole = speaker.member?.role || speaker.role || '';
                        const speakerPhoto = speaker.member?.photo || speaker.photo || '';
                        const speakerColor = palette[i % palette.length];
                        
                        return (
                            <div 
                                key={i} 
                                onClick={() => {
                                    if (speaker.member) {
                                        window.open(`/members`, '_blank');
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
                                        className="w-14 h-14 rounded-full overflow-hidden bg-neutral-800 border-2 border-neutral-700/50 transition-colors group-hover:border-[var(--hover-border)]"
                                    >
                                        {speakerPhoto ? (
                                            <img src={speakerPhoto} alt={speakerName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-neutral-500">
                                                {speakerName.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    {speaker.member && (
                                        <div 
                                            className="absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-neutral-900"
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
                                    <p className="text-sm text-neutral-400 truncate">{speakerRole}</p>
                                    {speaker.company && (
                                        <p className="text-xs text-neutral-500 font-medium mt-0.5">{speaker.company}</p>
                                    )}
                                </div>
                                {(speaker.member || speaker.link) && (
                                    <div className="text-neutral-600 group-hover:text-white transition-colors">
                                        {speaker.member ? <ArrowRight size={16} /> : <ExternalLink size={16} />}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </FadeInSection>
    );
};

export default EventSpeakers;
