import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import type { Partner } from '../../models/Partner';
import ThreeDCarousel from '../../components/ui/ThreeDCarousel';
import CollectionLayout from '../layouts/CollectionLayout';

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
            <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-950">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600"></div>
            </div>
        );
    }

    return (
        <CollectionLayout
            title="Nossos Parceiros"
            subtitle="Empresas e instituições que colaboram conosco."
        >
            {(viewMode) => (
                <div className="col-span-full">
                    {partners.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border dark:border-neutral-800 transition-colors">
                            <p className="text-neutral-500 dark:text-neutral-400 text-lg">
                                Estamos em busca de novas parcerias! Entre em contato.
                            </p>
                        </div>
                    ) : (
                        <>
                            {viewMode === 'card' ? (
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
                                                        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-xl transition-all duration-300 group h-64 border dark:border-neutral-800">
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
                                                            <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mt-2">{partner.name}</h3>
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
                                                            className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-primary-600' : 'bg-neutral-300'}`}
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
                            ) : (
                                /* Grid/List View */
                                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1'}`}>
                                    {partners.map((partner) => (
                                        <div
                                            key={partner.id}
                                            className={`bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 flex items-center justify-center hover:shadow-xl transition-all duration-300 group border dark:border-neutral-800 ${viewMode === 'list' ? 'flex-row justify-start gap-8' : 'flex-col h-64'}`}
                                        >
                                            <div className={`${viewMode === 'list' ? 'w-32' : 'w-full'} flex items-center justify-center`}>
                                                {partner.websiteUrl ? (
                                                    <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" className="block transform transition-transform group-hover:scale-105">
                                                        <img
                                                            src={partner.imageUrl}
                                                            alt={partner.name}
                                                            className="h-24 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                                                        />
                                                    </a>
                                                ) : (
                                                    <img
                                                        src={partner.imageUrl}
                                                        alt={partner.name}
                                                        className="h-24 object-contain grayscale group-hover:grayscale-0 transition-all duration-300 dark:brightness-200"
                                                    />
                                                )}
                                            </div>
                                            <div className={viewMode === 'list' ? 'flex-1' : 'mt-4 text-center'}>
                                                <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">{partner.name}</h3>
                                                {partner.websiteUrl && (
                                                    <a
                                                        href={partner.websiteUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-1 inline-block"
                                                    >
                                                        Visitar Website &rarr;
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </CollectionLayout>
    );
};

export default Partnerships;
