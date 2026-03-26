import React from 'react';
import { IoShieldCheckmarkOutline as Shield } from 'react-icons/io5';
import type { Partner } from '../../models/Partner';
import FadeInSection from './FadeInSection';

interface EventPartnersProps {
    partners: Partner[];
}

const EventPartners: React.FC<EventPartnersProps> = ({ partners }) => {
    if (!partners || partners.length === 0) return null;

    return (
        <FadeInSection delay="delay-500">
            <div 
                className="bg-white/5 border border-white/10 p-8 backdrop-blur-md"
                style={{ borderRadius: 'var(--event-radius-lg)' }}
            >
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                    <Shield 
                        size={24} 
                        style={{ color: `rgb(var(--event-primary-rgb) / 1)` }} 
                    />
                    Parceiros & Realização
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center justify-items-center">
                    {partners.map((partner) => (
                        <a
                            key={partner.id}
                            href={partner.websiteUrl || '#'}
                            target={partner.websiteUrl ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className={`group relative flex items-center justify-center p-4 bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-300 w-full aspect-[3/2] ${
                                !partner.websiteUrl && 'pointer-events-none'
                            }`}
                            style={{ borderRadius: 'var(--event-radius)' }}
                            title={partner.name}
                        >
                            <img
                                src={partner.imageUrl}
                                alt={partner.name}
                                className="max-w-full max-h-full object-contain filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                            />
                            {partner.websiteUrl && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(var(--event-primary-rgb))' }}></div>
                                </div>
                            )}
                        </a>
                    ))}
                </div>
            </div>
        </FadeInSection>
    );
};

export default EventPartners;
