import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { useSEO } from '../../hooks/useSEO';

const About: React.FC = () => {
    useSEO({
        title: 'Sobre a LIAO UFBA | História, Missão e Valores',
        description: 'Saiba quem somos. A LIAO UFBA promove o ensino, pesquisa e desenvolvimento prático em Inteligência Artificial e Otimização de Sistemas na Bahia.',
        ogImage: '/banner-new.jpg'
    });

    const [images, setImages] = useState<string[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    // Touch swipe states for mobile
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    const defaultImages = [
        '/IMG_9402.jpg',
        '/IMG_9386.jpg',
        '/IMG_9389.jpg',
        '/IMG_9348.jpg'
    ];

    const defaultAlts = [
        "Equipe LIAO reunida",
        "Membros com a bandeira",
        "Grupo sorrindo",
        "Membros celebrando"
    ];

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await apiService.getConfig('about_carousel_images');
                if (res.success && res.data) {
                    const parsed = JSON.parse(res.data);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setImages(parsed);
                        setLoading(false);
                        return;
                    }
                }
            } catch (err) {
                console.error('Error fetching about carousel images:', err);
            }
            setImages(defaultImages);
            setLoading(false);
        };
        fetchImages();
    }, []);

    // Automatic slide advance
    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images]);

    const nextSlide = () => {
        setCurrentSlide(prev => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide(prev => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    // Touch gesture handlers for mobile swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#141414] text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-liao-blue"></div>
            </div>
        );
    }

    return (
        <div className="about-page-wrapper bg-[#141414] text-white min-h-screen pt-28 pb-16 sm:pt-32 sm:pb-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center w-full relative overflow-hidden">
            
            {/* Styles Injection */}
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@500;700;800&display=swap');
                
                .about-page-wrapper {
                    font-family: 'Inter', sans-serif;
                }

                .about-page-wrapper h1, 
                .about-page-wrapper h2, 
                .about-page-wrapper h3, 
                .about-page-wrapper h4 {
                    font-family: 'Outfit', sans-serif;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .fade-in-up {
                    opacity: 0;
                    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                .delay-400 { animation-delay: 0.4s; }

                /* Carousel slide transition */
                .slide {
                    transition: opacity 0.8s ease-in-out, transform 3s ease-in-out;
                }
                .slide.active {
                    opacity: 1;
                    z-index: 10;
                    transform: scale(1.02); /* Slight zoom effect for life */
                }
                .slide.inactive {
                    opacity: 0;
                    z-index: 0;
                    transform: scale(1);
                }

                /* Hide scrollbar */
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />

            {/* Header / Logo */}
            <header className="text-center w-full max-w-7xl mx-auto mb-12 sm:mb-20 fade-in-up">
                <div className="flex justify-center mb-6 sm:mb-8">
                     <img src="/logo.png" alt="LIAO Logo" className="h-16 sm:h-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">Sobre a LIAO UFBA</h1>
                <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                    Conheça a Liga Acadêmica de Inteligência Artificial e Otimização da UFBA
                </p>
            </header>

            <main className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-20 sm:mb-32 relative">
                
                {/* Decorative Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl bg-gradient-to-r from-liao-blue/10 via-transparent to-liao-red/10 blur-[100px] rounded-full z-0 pointer-events-none"></div>

                {/* Mission Text Area */}
                <section className="space-y-6 sm:space-y-8 z-10 fade-in-up delay-100">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center gap-3 sm:gap-4 text-white">
                        <span className="w-8 sm:w-10 h-1.5 bg-gradient-to-r from-liao-red to-liao-yellow rounded-full"></span>
                        Nossa Missão
                    </h2>
                    <div className="space-y-4 sm:space-y-5 text-gray-300 leading-relaxed text-base sm:text-lg md:text-xl font-light">
                        <p>
                            A LIAO tem como missão promover o conhecimento em inteligência artificial e otimização, conectando teoria e prática através de projetos, workshops e eventos.
                        </p>
                        <p>
                            Buscamos desenvolver as habilidades técnicas e interpessoais de nossos membros, preparando-os para os desafios do mercado de tecnologia.
                        </p>
                        <div className="bg-liao-card/50 border border-gray-800 rounded-2xl p-5 sm:p-6 mt-6 shadow-lg backdrop-blur-sm relative overflow-hidden group">
                            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-liao-blue to-liao-green"></div>
                            <p className="font-medium text-white/90 text-sm sm:text-base md:text-lg">
                                "Acreditamos no poder da colaboração e do aprendizado contínuo para inovar e resolver problemas complexos da sociedade."
                            </p>
                        </div>
                    </div>
                </section>

                {/* Image Carousel Area */}
                <section className="z-10 w-full fade-in-up delay-200">
                    <div 
                        id="carousel-container" 
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        className="relative group rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-[#0a0a0a] border border-gray-800/60 aspect-[4/3] md:aspect-[16/10] touch-pan-y"
                    >
                        
                        {/* Slides Container */}
                        <div id="slides-wrapper" className="w-full h-full relative">
                            {images.map((url, index) => (
                                <div
                                    key={index}
                                    className={`slide absolute inset-0 w-full h-full ${
                                        index === currentSlide ? 'active' : 'inactive'
                                    }`}
                                >
                                    <img 
                                        src={url} 
                                        alt={defaultAlts[index] || `Slide ${index + 1}`} 
                                        className="w-full h-full object-cover" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"></div>
                                </div>
                            ))}
                        </div>

                        {/* Prev Button */}
                        <button 
                            onClick={prevSlide} 
                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-black/80 hover:scale-110 active:scale-95 z-20 cursor-pointer"
                            aria-label="Slide anterior"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 sm:w-6 h-5 sm:h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        
                        {/* Next Button */}
                        <button 
                            onClick={nextSlide} 
                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-black/80 hover:scale-110 active:scale-95 z-20 cursor-pointer"
                            aria-label="Próximo slide"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 sm:w-6 h-5 sm:h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>

                        {/* Dots Indicators */}
                        <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20" id="carousel-dots">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`dot rounded-full transition-all duration-300 cursor-pointer ${
                                        index === currentSlide 
                                            ? 'w-6 sm:w-8 h-1.5 bg-white' 
                                            : 'w-2 sm:w-3 h-1.5 bg-white/40 hover:bg-white/70'
                                    }`}
                                    aria-label={`Ir para o slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <section className="w-full max-w-7xl mx-auto fade-in-up delay-300">
                <div className="text-center mb-12 sm:mb-16 relative">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold inline-block relative pb-4 text-white">
                        Nossos Valores
                        {/* Underline decoration using logo colors */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1.5 flex rounded-full overflow-hidden opacity-80">
                            <div className="h-full w-1/4 bg-liao-red"></div>
                            <div className="h-full w-1/4 bg-liao-yellow"></div>
                            <div className="h-full w-1/4 bg-liao-blue"></div>
                            <div className="h-full w-1/4 bg-liao-green"></div>
                        </div>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Value 1: L (Red) */}
                    <div className="bg-liao-card rounded-2xl p-6 sm:p-8 text-center group hover:-translate-y-2 lg:hover:-translate-y-3 transition-all duration-300 relative overflow-hidden border border-gray-800 hover:border-liao-red/50 shadow-lg hover:shadow-liao-red/20">
                        <div className="absolute top-0 left-0 w-full h-1 bg-liao-red transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gray-800/80 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-liao-red/10 transition-colors duration-300 border border-gray-700 group-hover:border-liao-red/30">
                            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400 group-hover:text-liao-red transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white group-hover:text-liao-red transition-colors duration-300">Excelência</h3>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                            Buscamos a qualidade e a melhoria contínua em tudo que fazemos, elevando o padrão de nossos projetos.
                        </p>
                    </div>

                    {/* Value 2: I (Yellow) */}
                    <div className="bg-liao-card rounded-2xl p-6 sm:p-8 text-center group hover:-translate-y-2 lg:hover:-translate-y-3 transition-all duration-300 relative overflow-hidden border border-gray-800 hover:border-liao-yellow/50 shadow-lg hover:shadow-liao-yellow/20">
                        <div className="absolute top-0 left-0 w-full h-1 bg-liao-yellow transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gray-800/80 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-liao-yellow/10 transition-colors duration-300 border border-gray-700 group-hover:border-liao-yellow/30">
                            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400 group-hover:text-liao-yellow transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white group-hover:text-liao-yellow transition-colors duration-300">Colaboração</h3>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                            Trabalhamos juntos, compartilhando conhecimento e experiências para alcançar objetivos em comum.
                        </p>
                    </div>

                    {/* Value 3: A (Blue) */}
                    <div className="bg-liao-card rounded-2xl p-6 sm:p-8 text-center group hover:-translate-y-2 lg:hover:-translate-y-3 transition-all duration-300 relative overflow-hidden border border-gray-800 hover:border-liao-blue/50 shadow-lg hover:shadow-liao-blue/20">
                        <div className="absolute top-0 left-0 w-full h-1 bg-liao-blue transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gray-800/80 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-liao-blue/10 transition-colors duration-300 border border-gray-700 group-hover:border-liao-blue/30">
                            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400 group-hover:text-liao-blue transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white group-hover:text-liao-blue transition-colors duration-300">Inovação</h3>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                            Exploramos novas ideias e tecnologias, pensando fora da caixa para criar soluções impactantes.
                        </p>
                    </div>

                    {/* Value 4: O (Green) */}
                    <div className="bg-liao-card rounded-2xl p-6 sm:p-8 text-center group hover:-translate-y-2 lg:hover:-translate-y-3 transition-all duration-300 relative overflow-hidden border border-gray-800 hover:border-liao-green/50 shadow-lg hover:shadow-liao-green/20">
                        <div className="absolute top-0 left-0 w-full h-1 bg-liao-green transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gray-800/80 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-liao-green/10 transition-colors duration-300 border border-gray-700 group-hover:border-liao-green/30">
                            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400 group-hover:text-liao-green transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white group-hover:text-liao-green transition-colors duration-300">Otimização</h3>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                            Aplicamos IA e algoritmos avançados para gerar resultados e resolver problemas complexos.
                        </p>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default About;
