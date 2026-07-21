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

        // Extract clean description text
        let cleanDescription = event.description || "";
        if (cleanDescription.trim().startsWith('{')) {
            try {
                const sanitized = cleanDescription.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
                const parsed = JSON.parse(sanitized);
                cleanDescription = parsed?.presentation?.content || "";
            } catch (e) {
                console.warn("FAQ: Failed to parse structured content for calendar", e);
            }
        }

        // Add event link to the details
        const eventLink = window.location.href;
        const detailsText = `${cleanDescription}\n\nSaiba mais em: ${eventLink}`;

        const startDate = new Date(event.date as string);
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

        const formatGCalDate = (date: Date) => {
            return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
        };

        const title = encodeURIComponent(event.title);
        const details = encodeURIComponent(detailsText);
        const location = encodeURIComponent(event.location || "");
        const dates = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;

        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
        
        window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <FadeInSection delay="delay-500">
            <div 
                className="relative overflow-hidden p-8 border border-neutral-200 dark:border-white/10 shadow-xl dark:shadow-2xl"
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
                        className="w-16 h-16 mx-auto bg-neutral-800/10 dark:bg-white/10 flex items-center justify-center backdrop-blur-sm border border-neutral-200 dark:border-white/20"
                        style={{ borderRadius: 'var(--event-radius)' }}
                    >
                        <Bell size={28} className="text-neutral-800 dark:text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Não perca!</h3>
                        <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                            Adicione este evento à sua agenda e fique por dentro de todas as novidades.
                        </p>
                    </div>
                    {event.subscribe && (
                        <button 
                            onClick={() => window.open(event.subscribe as string, '_blank', 'noopener,noreferrer')}
                            className="w-full btn-special py-4"
                            style={{ borderRadius: 'var(--event-radius-sm)' }}
                        >
                            Quero me Inscrever
                        </button>
                    )}
                    <button 
                        onClick={handleAddToCalendar}
                        className={`w-full py-4 font-bold transition-all active:scale-[0.98] ${
                            event.subscribe 
                                ? 'bg-neutral-800/5 dark:bg-white/5 text-neutral-850 dark:text-white hover:bg-neutral-850/10 dark:hover:bg-white/10 border border-neutral-300 dark:border-white/10' 
                                : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-lg'
                        }`}
                        style={{ borderRadius: 'var(--event-radius-sm)' }}
                    >
                        {event.subscribe ? 'Lembrar-me (Agenda)' : 'Notificar-me'}
                    </button>
                </div>
            </div>
        </FadeInSection>
    );
};

export default EventCTA;
