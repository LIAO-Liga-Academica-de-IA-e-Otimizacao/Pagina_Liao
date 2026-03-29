import React from 'react';
import { IoNotificationsOutline as Bell } from 'react-icons/io5';
import type { EventApi } from '../../models/Event';
import FadeInSection from './FadeInSection';

interface EventCTAProps {
    event: EventApi;
}

const EventCTA: React.FC<EventCTAProps> = ({ event }) => {
    const handleAddToCalendar = () => {
        if (!event) return;

        const startDate = new Date(event.date as string);
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

        const formatGCalDate = (date: Date) => {
            return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
        };

        const title = encodeURIComponent(event.title);
        const details = encodeURIComponent(event.description || "");
        const location = encodeURIComponent(event.location || "");
        const dates = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;

        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
        
        window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');
    };

    return (
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
                        <p className="text-neutral-300 text-sm leading-relaxed">
                            Adicione este evento à sua agenda e fique por dentro de todas as novidades.
                        </p>
                    </div>
                    <button 
                        onClick={handleAddToCalendar}
                        className="w-full py-4 bg-white text-neutral-950 font-bold hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10 active:scale-[0.98] transition-all"
                        style={{ borderRadius: 'var(--event-radius-sm)' }}
                    >
                        Notificar-me
                    </button>
                </div>
            </div>
        </FadeInSection>
    );
};

export default EventCTA;
