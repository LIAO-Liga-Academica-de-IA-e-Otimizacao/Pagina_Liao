import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import type { EventApi } from '../../models/Event';
import EventCard from '../../components/domain/EventCard';

const Events: React.FC = () => {
    const [events, setEvents] = useState<EventApi[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await apiService.getEvents() as any;
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-24 pb-12 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
                        Eventos LIAO
                    </h1>
                    <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                        Fique por dentro das nossas palestras, workshops, maratonas e encontros sobre inteligência artificial e otimização.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-neutral-800 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-700">
                        <svg className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-xl font-medium text-neutral-900 dark:text-white">Nenhum evento encontrado</h3>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-2">Em breve teremos novidades por aqui!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
