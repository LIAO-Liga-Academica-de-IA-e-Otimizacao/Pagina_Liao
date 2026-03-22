import React from 'react';
import { Link } from 'react-router-dom';
import type { EventApi } from '../models/Event';

type EventCardProps = {
    event: EventApi;
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const eventDate = new Date(event.date as string).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    return (
        <Link 
            to={`/events/${event.slug}`}
            className="group block bg-white dark:bg-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-zinc-700 h-full transform hover:-translate-y-2"
        >
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
                <img 
                    src={event.coverImage} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <span className="text-white font-medium flex items-center gap-2">
                        Ver detalhes
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </span>
                </div>
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                        {eventDate}
                    </span>
                </div>
            </div>

            {/* Content Container */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {event.title}
                </h3>
                
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4 gap-4">
                    {event.location && (
                        <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate max-w-[150px]">{event.location}</span>
                        </div>
                    )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                    {event.description}
                </p>

                <div className="pt-4 border-t border-gray-100 dark:border-zinc-700 flex justify-between items-center">
                    <span className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
                        Saber mais
                    </span>
                    <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-zinc-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
