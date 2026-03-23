import React from 'react';
import { IoSparkles as Sparkles } from 'react-icons/io5';
import FadeInSection from './FadeInSection';

interface EventHighlightsProps {
    highlights: string[];
}

const EventHighlights: React.FC<EventHighlightsProps> = ({ highlights }) => {
    if (!highlights || highlights.length === 0) return null;

    return (
        <FadeInSection delay="delay-100">
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                    <h3 className="text-2xl font-bold tracking-tight text-white px-4">O que esperar</h3>
                    <div className="h-px flex-1 bg-gradient-to-l from-white/20 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {highlights.map((highlight, idx) => (
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
    );
};

export default EventHighlights;
