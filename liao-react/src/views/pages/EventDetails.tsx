import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import type { Event } from '../../models/Event';

const EventDetails: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!slug) return;
            try {
                const response = await apiService.getEventBySlug(slug);
                setEvent(response.data.data);
            } catch (error) {
                console.error('Error fetching event details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Ops! Evento não encontrado.</h1>
                <Link to="/events" className="text-indigo-600 hover:text-indigo-800 font-medium underline">
                    Voltar para a lista de eventos
                </Link>
            </div>
        );
    }

    const eventDate = new Date(event.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <img 
                    src={event.coverImage} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                    <div className="max-w-7xl mx-auto">
                        <Link 
                            to="/events" 
                            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Voltar para eventos
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                            {event.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/90">
                            <div className="flex items-center gap-2">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-lg font-medium">{eventDate}</span>
                            </div>
                            {event.location && (
                                <div className="flex items-center gap-2">
                                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-lg font-medium">{event.location}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Sobre o Evento</h2>
                            <p className="text-xl text-gray-600 leading-relaxed whitespace-pre-line">
                                {event.description}
                            </p>
                        </section>

                        {event.highlights && event.highlights.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Destaques</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {event.highlights.map((h, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                            <div className="mt-1 flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-700 font-medium">{h}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {event.gallery && event.gallery.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Galeria</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {event.gallery.map((img, i) => (
                                        <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-sm group cursor-pointer">
                                            <img 
                                                src={img} 
                                                alt={`Galeria ${i + 1}`} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {event.speakers && event.speakers.length > 0 && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Palestrantes
                                </h3>
                                <ul className="space-y-4">
                                    {event.speakers.map((s, i) => (
                                        <li key={i} className="flex items-center gap-4 group">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                {s.charAt(0)}
                                            </div>
                                            <span className="text-gray-900 font-medium text-lg">{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl shadow-lg text-white">
                            <h3 className="text-2xl font-bold mb-4">Interessado?</h3>
                            <p className="text-white/80 mb-6">
                                Participe dos nossos eventos e faça parte da maior liga de IA e Otimização da UFBA.
                            </p>
                            <button className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors">
                                Notificar-me
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
