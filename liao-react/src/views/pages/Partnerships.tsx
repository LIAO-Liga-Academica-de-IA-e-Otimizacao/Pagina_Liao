import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import type { Partner } from '../../models/Partner';
import ThreeDCarousel from '../../components/ui/ThreeDCarousel';

const Partnerships: React.FC = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);

    const [itemsPerView, setItemsPerView] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Touch Support
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await apiService.getPartners();
                setPartners(response.data || []);
            } catch (error) {
                console.error('Error fetching partners:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPartners();
    }, []);

    // Resize Handler
    useEffect(() => {
        const handleResize = () => {
            setItemsPerView(window.innerWidth < 768 ? 1 : 3);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-Advance
    useEffect(() => {
        if (itemsPerView > 1 || partners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev >= partners.length - 1 ? 0 : prev + 1));
        }, 3000);
        return () => clearInterval(interval);
    }, [itemsPerView, partners.length]);

    // Touch Handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            setCurrentIndex((prev) => (prev >= partners.length - 1 ? 0 : prev + 1));
        }
        if (isRightSwipe) {
            setCurrentIndex((prev) => (prev <= 0 ? partners.length - 1 : prev - 1));
        }
        setTouchStart(0);
        setTouchEnd(0);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-12 transition-colors duration-200 bg-gray-50 dark:bg-zinc-950">
            <div className="py-12 px-4 transition-colors bg-gray-900 text-white dark:bg-black/60 dark:backdrop-blur-md dark:border-b dark:border-zinc-800">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Nossos Parceiros</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Empresas e instituições que colaboram conosco.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {partners.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border dark:border-zinc-800 transition-colors">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            Estamos em busca de novas parcerias! Entre em contato.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Carousel (Screen < 768px) */}
                        {itemsPerView === 1 ? (
                            <div
                                className="relative group overflow-hidden"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                                >
                                    {partners.map((partner) => (
                                        <div
                                            key={partner.id}
                                            style={{ width: '100%' }}
                                            className="shrink-0 px-4"
                                        >
                                            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-xl transition-all duration-300 group h-64 border dark:border-zinc-800">
                                                {partner.websiteUrl ? (
                                                    <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" className="block transform transition-transform group-hover:scale-105">
                                                        <img
                                                            src={partner.imageUrl}
                                                            alt={partner.name}
                                                            className="h-32 object-contain mb-4 grayscale hover:grayscale-0 transition-all duration-300"
                                                        />
                                                    </a>
                                                ) : (
                                                    <img
                                                        src={partner.imageUrl}
                                                        alt={partner.name}
                                                        className="h-32 object-contain mb-4 grayscale hover:grayscale-0 transition-all duration-300 dark:brightness-200"
                                                    />
                                                )}
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-2">{partner.name}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Indicators */}
                                {partners.length > 1 && (
                                    <div className="flex justify-center mt-6 space-x-2">
                                        {partners.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Desktop Carousel */
                            <div className="py-12">
                                <ThreeDCarousel partners={partners} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Partnerships;
