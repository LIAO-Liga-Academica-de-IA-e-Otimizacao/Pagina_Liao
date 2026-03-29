import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import type { Member } from '../../models/Member';
import type { Article } from '../../models/Article';

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
                            className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 h-full flex flex-col cursor-pointer"
                        >
                            <div className="h-20 md:h-48 overflow-hidden relative group">
                                {article.images && article.images.length > 0 ? (
                                    <img
                                        src={article.images[0]}
                                        alt={article.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-tr from-neutral-200 to-neutral-300 flex items-center justify-center text-neutral-500 text-[10px] md:text-base">
                                        LIAO
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity" />
                            </div>

                            <div className="p-2 md:p-6 flex-1 flex flex-col">
                                <span className="text-[8px] md:text-xs font-bold text-success-600 uppercase tracking-wider mb-1 md:mb-2">
                                    {article.tags?.[0] || 'Novidade'}
                                </span>
                                <h3 className="text-[10px] md:text-lg font-bold text-neutral-900 mb-1 md:mb-2 leading-tight line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-neutral-600 text-[8px] md:text-sm line-clamp-2 md:line-clamp-3 mb-2 md:mb-4 flex-1">
                                    {article.description || article.content}
                                </p>
                                <span className="text-[8px] md:text-xs text-neutral-400 font-medium mt-auto">
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
                        className="hidden md:block absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 text-neutral-800 p-2 rounded-full shadow hover:bg-white focus:outline-none z-10 transition-all hover:scale-110"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                        className="hidden md:block absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 text-neutral-800 p-2 rounded-full shadow hover:bg-white focus:outline-none z-10 transition-all hover:scale-110"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </>
            )}
        </div>
    );
};

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ members: 0, tutors: 0, projects: 0 });
    const [recentArticles, setRecentArticles] = useState<Article[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch basic counts and latest news
                const [membersRes, tutorsRes, projectsRes, articlesRes] = await Promise.all([
                    apiService.getMembers(),
                    apiService.getTutors(),
                    apiService.getProjects(),
                    apiService.getArticles(),
                ]);

                // Extract data safely
                const members = (membersRes.success && Array.isArray(membersRes.data)) ? membersRes.data : [];
                const tutors = (tutorsRes.success && Array.isArray(tutorsRes.data?.tutors || tutorsRes.data)) ? (tutorsRes.data?.tutors || tutorsRes.data) : [];
                const projects = (projectsRes.success && Array.isArray(projectsRes.data)) ? projectsRes.data : [];
                const articles = (articlesRes.success && Array.isArray(articlesRes.data)) ? articlesRes.data : [];

                setStats({
                    members: members.filter((m: Member) => m.isActive !== false).length,
                    tutors: tutors.length,
                    projects: projects.length,
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
            {/* Hero Section - Professional & Minimal */}
            <section className="relative h-[120px] sm:h-[200px] md:h-[450px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 z-0 transform scale-105"
                    style={{
                        backgroundImage: 'url("/banner-new.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </section>

            {/* Stats Section - Clean & Modern */}
            <section className="py-20 bg-white dark:bg-neutral-900 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-sm font-bold text-primary-600 uppercase tracking-widest">Nossa Comunidade</span>
                        <h2 className="text-3xl font-bold mt-2 text-neutral-900 dark:text-white">Impacto em Números</h2>
                    </div>

                    <div className="grid grid-cols-3 gap-2 md:gap-12 text-center">
                        <div className="p-2 md:p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 hover:shadow-lg transition-all">
                            <div className="text-2xl md:text-6xl font-black text-neutral-900 mb-2 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500">
                                {stats.members}
                            </div>
                            <div className="text-[10px] md:text-lg font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Membros Ativos</div>
                        </div>
                        <div className="p-2 md:p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 hover:shadow-lg transition-all">
                            <div className="text-2xl md:text-6xl font-black text-neutral-900 mb-2 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-accent-600 to-pink-500">
                                {stats.projects}
                            </div>
                            <div className="text-[10px] md:text-lg font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Projetos Realizados</div>
                        </div>
                        <div className="p-2 md:p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 hover:shadow-lg transition-all">
                            <div className="text-2xl md:text-6xl font-black text-neutral-900 mb-2 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-success-600 to-emerald-500">
                                {stats.tutors}
                            </div>
                            <div className="text-[10px] md:text-lg font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Tutores Disponíveis</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest News - Carousel */}
            <section className="py-20 bg-neutral-900 text-white relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-600 rounded-full opacity-10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-success-500 rounded-full opacity-10 blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <span className="text-sm font-bold text-success-400 uppercase tracking-widest">Atualizações</span>
                            <h2 className="text-4xl font-bold mt-2">Últimas Notícias</h2>
                        </div>
                        <Link
                            to="/newsletter"
                            className="mt-4 md:mt-0 text-white border-b-2 border-success-500 pb-1 hover:text-success-400 transition-colors text-sm font-bold uppercase tracking-wide"
                        >
                            Ver Todas as Notícias &rarr;
                        </Link>
                    </div>

                    {recentArticles.length > 0 ? (
                        <NewsCarousel articles={recentArticles} />
                    ) : (
                        <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700">
                            <p className="text-neutral-400">Nenhuma notícia publicada ainda.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action - Modern Gradient */}
            <section className="py-24 bg-gradient-to-br from-primary-900 to-black text-white relative">
                <div className="absolute inset-0 bg-[url('/bg-grid.svg')] opacity-10"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        Pronto para o próximo nível?
                    </h2>
                    <p className="text-xl text-neutral-300 mb-10 leading-relaxed">
                        Faça parte de uma comunidade apaixonada por tecnologia e inovação.
                        Inscreva-se no nosso processo seletivo e potencialize sua jornada acadêmica.
                    </p>
                    <Link
                        to="/prosel"
                        className="inline-block px-10 py-5 bg-success-500 text-white rounded-full font-bold text-lg hover:bg-success-600 hover:shadow-2xl hover:-translate-y-1 transition-all shadow-lg shadow-success-900/50"
                    >
                        Quero me Inscrever
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
