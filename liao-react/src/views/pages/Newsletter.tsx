import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added useNavigate
import { apiService } from '../../services/api';
import type { Article } from '../../models/Article';

const Newsletter: React.FC = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'card' | 'list' | 'grid'>('card');

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await apiService.getArticles();
                const data = Array.isArray(res.data.data) ? res.data.data : [];
                setArticles(data);
            } catch (error) {
                console.error('Error fetching articles:', error);
                setArticles([]);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.description && article.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600"></div>
            </div>
        );
    }

    const getContainerClass = () => {
        switch (viewMode) {
            case 'list': return 'flex flex-col gap-4';
            case 'grid': return 'grid grid-cols-2 md:grid-cols-4 gap-4';
            default: return 'grid grid-cols-1 md:grid-cols-3 gap-8';
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <h1 className="section-title dark:text-white mb-4 md:mb-0">Newsletter & Artigos</h1>

                    {/* Controls: Search + View Mode */}
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
                        {/* Search Bar */}
                        <div className="w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Pesquisar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 text-sm placeholder-neutral-500 dark:placeholder-neutral-400 transition-colors"
                            />
                        </div>

                        {/* View Switcher */}
                        <div className="flex bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-1 transition-colors">
                            <button
                                onClick={() => setViewMode('card')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'card' ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400' : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
                                title="Visualização em Cards"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400' : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
                                title="Visualização em Lista"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400' : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
                                title="Grid Compacto"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={getContainerClass()}>
                    {filteredArticles.map((article) => (
                        <div
                            key={article.id}
                            onClick={() => navigate(`/newsletter/${article.id}`)}
                            className={`
                                group bg-white dark:bg-neutral-800 rounded-lg border border-neutral-100 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer
                                ${viewMode === 'list' ? 'flex flex-row h-56' : 'flex flex-col h-full'}
                            `}
                        >
                            {/* Image Section */}
                            <div className={`
                                relative overflow-hidden bg-neutral-200 dark:bg-neutral-700
                                ${viewMode === 'list' ? 'w-48 shrink-0' : ''}
                                ${viewMode === 'grid' ? 'h-32' : ''}
                                ${viewMode === 'card' ? 'h-48' : ''}
                            `}>
                                {article.images && article.images.length > 0 ? (
                                    <>
                                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity z-10" />
                                        <img
                                            src={article.images[0]}
                                            alt={article.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-400 dark:text-neutral-500 text-xs">
                                        Sem imagem
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className={`
                                flex flex-col
                                ${viewMode === 'list' ? 'p-4 justify-between flex-1' : 'p-5 flex-1'}
                                ${viewMode === 'grid' ? 'p-3' : ''}
                            `}>
                                {(viewMode === 'card' || viewMode === 'list') && (
                                    <div className="mb-2 flex flex-wrap gap-2">
                                        {article.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-[10px] font-bold uppercase tracking-wide rounded-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <h2 className={`
                                    font-bold text-neutral-900 dark:text-white leading-tight group-hover:text-success-700 dark:group-hover:text-success-500 transition-colors
                                    ${viewMode === 'grid' ? 'text-sm mb-1 line-clamp-3' : 'text-lg mb-2'}
                                `}>
                                    {article.title}
                                </h2>

                                {viewMode !== 'grid' && (
                                    <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed line-clamp-4 md:line-clamp-6 mb-4">
                                        {article.description || article.content}
                                    </p>
                                )}

                                <div className={`
                                    flex items-center justify-between
                                    ${viewMode === 'grid' ? 'mt-2' : 'mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-700'}
                                `}>
                                    <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                                        {new Date(article.createdAt).toLocaleDateString('pt-BR')}
                                    </span>
                                    <button
                                        className={`
                                            text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors
                                            ${viewMode === 'grid' ? 'text-xs' : ''}
                                        `}
                                    >
                                        Ler mais &rarr;
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredArticles.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                            {searchTerm ? 'Nenhum resultado encontrado.' : 'Nenhuma notícia publicada ainda.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Newsletter;
