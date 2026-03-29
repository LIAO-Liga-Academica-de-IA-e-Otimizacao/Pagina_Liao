import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import type { Article } from '../../models/Article';

const ArticleDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;
            try {
                const res = await apiService.getArticles();
                const data = Array.isArray(res.data) ? res.data : [];
                const found = data.find((a: Article) => a.id === Number(id));
                setArticle(found || null);
            } catch (error) {
                console.error('Error fetching article:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
                <h2 className="text-2xl font-bold mb-4">Artigo não encontrado 😕</h2>
                <button
                    onClick={() => navigate('/newsletter')}
                    className="text-primary-600 hover:text-primary-800 font-medium hover:underline"
                >
                    &larr; Voltar para Newsletter
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300">
            {/* Hero Section */}
            <div className="w-full bg-neutral-900 h-64 md:h-96 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                {article.images && article.images.length > 0 ? (
                    <img
                        src={article.images[0]}
                        alt={article.title}
                        className="w-full h-full object-cover opacity-80"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900 via-neutral-900 to-black">
                        <span className="text-white opacity-10 text-9xl font-black tracking-tighter">LIAO</span>
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 max-w-5xl mx-auto text-white">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {article.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-primary-600/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/20">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 drop-shadow-2xl">
                        {article.title}
                    </h1>
                    <div className="flex items-center gap-4 text-neutral-300 text-sm font-semibold">
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {new Date(article.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <article className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                {/* Intro / Description if exists */}
                {article.description && (
                    <div className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 leading-relaxed font-light mb-16 border-l-4 border-primary-500 pl-8 italic">
                        {article.description}
                    </div>
                )}

                {/* Main Content */}
                <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-300 whitespace-pre-wrap leading-loose mb-20">
                    {article.content}
                </div>

                {/* References Section */}
                {article.references && article.references.length > 0 && (
                    <div className="mt-16 py-10 border-t dark:border-neutral-800">
                        <h3 className="text-lg font-black text-neutral-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-3">
                            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            Referências Acadêmicas e Fontes
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {article.references.map((ref, i) => (
                                <li key={i} className="flex items-start gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border dark:border-neutral-800 group hover:border-primary-500/50 transition-all">
                                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-neutral-700 shadow-sm text-primary-600 dark:text-primary-400 font-bold text-xs border dark:border-neutral-600">
                                        {i + 1}
                                    </span>
                                    {ref.startsWith('http') ? (
                                        <a href={ref} target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 break-words transition-colors underline decoration-neutral-300 dark:decoration-neutral-700 hover:decoration-primary-500">
                                            {ref}
                                        </a>
                                    ) : (
                                        <span className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{ref}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Gallery if more images */}
                {article.images && article.images.length > 1 && (
                    <div className="mt-10 py-12 border-t dark:border-neutral-800">
                        <h3 className="text-2xl font-black text-neutral-900 dark:text-white mb-8 tracking-tight">Galeria de Imagens</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {article.images.slice(1).map((img, idx) => (
                                <div key={idx} className="group relative overflow-hidden rounded-2xl shadow-lg aspect-video bg-neutral-100 dark:bg-neutral-800 cursor-pointer">
                                    <img
                                        src={img}
                                        alt={`Galeria ${idx}`}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Back Button Footer */}
                <div className="mt-20 pt-10 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                    <button
                        onClick={() => navigate('/newsletter')}
                        className="flex items-center gap-3 px-6 py-3 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-primary-600 hover:text-white font-bold transition-all duration-300 transform hover:-translate-x-2 shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Voltar para Newsletter
                    </button>
                </div>
            </article>
        </div>
    );
};

export default ArticleDetails;
