import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import type { Member } from '../../models/Member';
import type { Article } from '../../models/Article';
import InteractiveBanner from '../../components/ui/InteractiveBanner';
import { useSEO } from '../../hooks/useSEO';
import Button from '../../components/ui/Button';

// Simple Carousel Component
const NewsCarousel: React.FC<{ articles: Article[] }> = ({ articles }) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Logic for "TranslateX" auto-sliding carousel
    // Rules:
    // 1. Horizontal track slides automatically.
    // 2. Interval 3s, advances 1 slide.
    // 3. Always 3 cards visible (desktop and mobile).

    // We display 3 items per "screen". 
    // To advance 1 slide, we shift by 33.33%.
    // To avoid empty space at the end, we stop when (index) > (total - 3).
    // Or we loop back to 0. simple loop for now.

    const maxIndex = Math.max(0, articles.length - 3);

    useEffect(() => {
        if (articles.length <= 3) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
        }, 3000);

        return () => clearInterval(interval);
    }, [articles.length, maxIndex]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    return (
        <div className="relative group overflow-hidden">
            {/* Track Container */}
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
                {articles.map((article, idx) => (
                    <div
                        key={`${article.id}-${idx}`}
                        className="w-1/3 shrink-0 px-2" // Each item is 33.33% width + padding for gap
                    >
                        <div
                            onClick={() => navigate(`/newsletter/${article.id}`)}
                            className="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 dark:border-neutral-800 h-full flex flex-col cursor-pointer"
                        >
                            <div className="h-20 md:h-48 overflow-hidden relative group">
                                {article.images && article.images.length > 0 ? (
                                    <img
                                        src={article.images[0]}
                                        alt={article.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-tr from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400 text-[10px] md:text-base">
                                        LIAO
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity" />
                            </div>

                            <div className="p-2 md:p-6 flex-1 flex flex-col">
                                <span className="text-[8px] md:text-xs font-bold text-success-600 dark:text-success-400 uppercase tracking-wider mb-1 md:mb-2">
                                    {article.tags?.[0] || 'Novidade'}
                                </span>
                                <h3 className="text-[10px] md:text-lg font-bold text-neutral-900 dark:text-white mb-1 md:mb-2 leading-tight line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-300 text-[8px] md:text-sm line-clamp-2 md:line-clamp-3 mb-2 md:mb-4 flex-1">
                                    {article.description || article.content}
                                </p>
                                <span className="text-[8px] md:text-xs text-neutral-400 dark:text-neutral-500 font-medium mt-auto">
                                    {new Date(article.createdAt).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            {articles.length > 3 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                        className="hidden md:block absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 p-2 rounded-full shadow hover:bg-white dark:hover:bg-neutral-700 focus:outline-none z-10 transition-all hover:scale-110 border border-neutral-100 dark:border-neutral-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                        className="hidden md:block absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 p-2 rounded-full shadow hover:bg-white dark:hover:bg-neutral-700 focus:outline-none z-10 transition-all hover:scale-110 border border-neutral-100 dark:border-neutral-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </>
            )}
        </div>
    );
};

const Dashboard: React.FC = () => {
    useSEO({
        title: 'LIAO UFBA | Liga Acadêmica de Inteligência Artificial e Otimização',
        description: 'Site oficial da LIAO, a Liga Acadêmica de Inteligência Artificial e Otimização da UFBA. Conheça nossos projetos, artigos, membros e processo seletivo.',
        ogImage: '/banner-new.jpg'
    });

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ members: 0, projects: 0, articles: 0, events: 0 });
    const [recentArticles, setRecentArticles] = useState<Article[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch basic counts, events and latest news
                const [membersRes, projectsRes, articlesRes, eventsRes] = await Promise.all([
                    apiService.getMembers(),
                    apiService.getProjects(),
                    apiService.getArticles(),
                    apiService.getEvents(),
                ]);

                // Extract data safely
                const members = (membersRes.success && Array.isArray(membersRes.data)) ? membersRes.data : [];
                const projects = (projectsRes.success && Array.isArray(projectsRes.data)) ? projectsRes.data : [];
                const articles = (articlesRes.success && Array.isArray(articlesRes.data)) ? articlesRes.data : [];
                const events = (eventsRes.success && Array.isArray(eventsRes.data)) ? eventsRes.data : [];

                setStats({
                    members: members.filter((m: Member) => m.isActive !== false).length,
                    projects: projects.length,
                    articles: articles.length,
                    events: events.length,
                });

                // Sort articles by date descending
                const sortedArticles = articles.sort((a: Article, b: Article) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                // Keep top 6 for carousel to have enough content to rotate
                setRecentArticles(sortedArticles.slice(0, 6));

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-neutral-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-neutral-900 dark:border-neutral-100 border-opacity-50"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans">
            {/* Hero Section - Interactive Particle Canvas Banner */}
            <InteractiveBanner />

            {/* Intro Section - SEO Entity & Presentation */}
            <section className="py-16 bg-neutral-50 dark:bg-neutral-900/40 border-b border-neutral-100 dark:border-neutral-800 transition-colors duration-200">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                        A <strong className="font-semibold text-neutral-900 dark:text-white">LIAO (Liga Acadêmica de Inteligência Artificial e Otimização)</strong> é uma entidade estudantil oficial da <strong className="font-semibold text-neutral-900 dark:text-white">UFBA (Universidade Federal da Bahia)</strong>, sediada em Salvador. Nosso objetivo é fomentar o ensino, a pesquisa e a extensão nas áreas de ciência de dados, machine learning e otimização de sistemas, preparando talentos para a inovação acadêmica e profissional.
                    </p>
                </div>
            </section>

            {/* Stats Section - Clean & Modern */}
            <section className="py-20 section-bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-sm font-bold text-primary-600 uppercase tracking-widest">Nossa Comunidade</span>
                        <h2 className="text-3xl font-bold mt-2 text-neutral-900 dark:text-white">Impacto Acadêmico e Científico da LIAO UFBA</h2>
                    </div>

                    {/* Desktop: 4 Columns | Mobile: Horizontal Scrollable Row (Swipeable Slider with 2 cards visible) */}
                    <div className="flex md:grid overflow-x-auto md:overflow-visible gap-4 md:gap-6 md:grid-cols-4 pb-6 md:pb-0 snap-x snap-mandatory scrollbar-none">
                        {/* L - Membros Ativos (Red) */}
                        <div className="w-[calc(50%-8px)] min-w-[145px] md:w-auto md:min-w-0 flex-shrink-0 snap-center p-4 md:p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 hover:shadow-xl dark:hover:shadow-neutral-950/40 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
                            <div className="text-3xl sm:text-4xl md:text-6xl font-black mb-1 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#E53935] to-[#ef5350] drop-shadow-[0_2px_8px_rgba(229,57,53,0.15)]">
                                {stats.members}
                            </div>
                            <span className="text-[10px] md:text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-0.5 md:mb-1">L</span>
                            <div className="text-xs sm:text-sm md:text-lg font-bold text-neutral-800 dark:text-neutral-200 leading-tight">Membros Ativos</div>
                        </div>

                        {/* I - Projetos Realizados (Yellow) */}
                        <div className="w-[calc(50%-8px)] min-w-[145px] md:w-auto md:min-w-0 flex-shrink-0 snap-center p-4 md:p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 hover:shadow-xl dark:hover:shadow-neutral-950/40 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
                            <div className="text-3xl sm:text-4xl md:text-6xl font-black mb-1 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FBC02D] to-[#fdd835] drop-shadow-[0_2px_8px_rgba(251,192,45,0.15)]">
                                {stats.projects}
                            </div>
                            <span className="text-[10px] md:text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-0.5 md:mb-1">I</span>
                            <div className="text-xs sm:text-sm md:text-lg font-bold text-neutral-800 dark:text-neutral-200 leading-tight">Projetos Realizados</div>
                        </div>

                        {/* A - Artigos e Newsletter (Blue) */}
                        <div className="w-[calc(50%-8px)] min-w-[145px] md:w-auto md:min-w-0 flex-shrink-0 snap-center p-4 md:p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 hover:shadow-xl dark:hover:shadow-neutral-950/40 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
                            <div className="text-3xl sm:text-4xl md:text-6xl font-black mb-1 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#1E88E5] to-[#42a5f5] drop-shadow-[0_2px_8px_rgba(30,136,229,0.15)]">
                                {stats.articles}
                            </div>
                            <span className="text-[10px] md:text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-0.5 md:mb-1">Λ</span>
                            <div className="text-xs sm:text-sm md:text-lg font-bold text-neutral-800 dark:text-neutral-200 leading-tight">Artigos e Newsletter</div>
                        </div>

                        {/* O - Eventos e Extensão (Green) */}
                        <div className="w-[calc(50%-8px)] min-w-[145px] md:w-auto md:min-w-0 flex-shrink-0 snap-center p-4 md:p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 hover:shadow-xl dark:hover:shadow-neutral-950/40 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
                            <div className="text-3xl sm:text-4xl md:text-6xl font-black mb-1 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#43A047] to-[#66bb6a] drop-shadow-[0_2px_8px_rgba(67,160,71,0.15)]">
                                {stats.events}
                            </div>
                            <span className="text-[10px] md:text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-0.5 md:mb-1">O</span>
                            <div className="text-xs sm:text-sm md:text-lg font-bold text-neutral-800 dark:text-neutral-200 leading-tight">Eventos e Extensão</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest News - Carousel */}
            <section className="py-20 section-bg-alt text-neutral-900 dark:text-white border-t border-b border-neutral-200 dark:border-neutral-800/80 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-success-500/10 dark:bg-success-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <span className="text-sm font-bold text-success-400 uppercase tracking-widest">Atualizações</span>
                            <h2 className="text-4xl font-bold mt-2">Últimas Notícias sobre IA e Otimização</h2>
                        </div>
                        <Link
                            to="/newsletter"
                            className="mt-4 md:mt-0 text-neutral-900 dark:text-white border-b-2 border-success-500 pb-1 hover:text-success-600 dark:hover:text-success-400 transition-colors text-sm font-bold uppercase tracking-wide"
                        >
                            Ver Todas as Notícias &rarr;
                        </Link>
                    </div>

                    {recentArticles.length > 0 ? (
                        <NewsCarousel articles={recentArticles} />
                    ) : (
                        <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                            <p className="text-neutral-500 dark:text-neutral-400">Nenhuma notícia publicada ainda.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action - Modern Premium Grid */}
            <section className="py-24 premium-cta-bg text-neutral-900 dark:text-white border-t border-b border-neutral-200 dark:border-neutral-800/80 relative overflow-hidden">
                {/* Premium CSS Grid Pattern */}
                <div className="absolute inset-0 premium-grid pointer-events-none"></div>
                
                {/* Subtle Gold Central Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-gradient-to-tr from-[#bf953f]/10 to-[#b38728]/10 rounded-full blur-3xl pointer-events-none opacity-75 dark:opacity-30"></div>
                
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        Participe da Liga Acadêmica LIAO UFBA
                    </h2>
                    <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                        Faça parte de uma comunidade apaixonada por tecnologia e inovação.
                        Inscreva-se no nosso processo seletivo e potencialize sua jornada acadêmica.
                    </p>
                    <Link to="/prosel">
                        <Button variant="premium" size="lg">
                            Quero me Inscrever
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
