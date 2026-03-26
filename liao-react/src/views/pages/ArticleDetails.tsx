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
                // Assuming we can fetch a single article or we fetch all and find one. 
                // Ideally backend has getArticleById. 
                // Looking at backend controller, it only has getArticles (plural) which filters.
                // I might need to filter client side or update backend.
                // For now, let's fetch all and find, or assume I can implement getById on backend quickly. 
                // Actually, existing controller code (which I saw previously) only showed getArticles. 
                // Let's rely on getArticles for now or add getById. 
                // To simple start, let's fetch all and filter client side to avoid backend redeploy if unnecessary.
                const res = await apiService.getArticles();
                const data = Array.isArray(res.data.data) ? res.data.data : [];
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
            <div className="flex items-center justify-center min-h-screen bg-neutral-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-success-600"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 text-neutral-600">
                <h2 className="text-2xl font-bold mb-4">Artigo não encontrado 😕</h2>
                <button
                    onClick={() => navigate('/newsletter')}
                    className="text-success-700 hover:text-success-900 font-medium hover:underline"
                >
                    &larr; Voltar para Newsletter
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="w-full bg-neutral-900 h-64 md:h-96 relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
                {article.images && article.images.length > 0 ? (
                    <img
                        src={article.images[0]}
                        alt={article.title}
                        className="w-full h-full object-cover opacity-80"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-success-900 to-black">
                        <span className="text-white opacity-20 text-9xl font-bold">LIAO</span>
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 max-w-4xl mx-auto text-white">
                    <div className="flex gap-2 mb-4">
                        {article.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-success-500 bg-opacity-90 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
                        {article.title}
                    </h1>
                    <div className="flex items-center text-neutral-300 text-sm font-medium">
                        <span>{new Date(article.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <article className="max-w-3xl mx-auto px-6 py-12 md:py-20">
                {/* Intro / Description if exists */}
                {article.description && (
                    <div className="text-xl md:text-2xl text-neutral-600 leading-relaxed font-light mb-12 border-l-4 border-success-500 pl-6 italic">
                        {article.description}
                    </div>
                )}

                {/* Main Content */}
                <div className="prose prose-lg prose-success mx-auto text-neutral-800 whitespace-pre-wrap leading-loose">
                    {article.content}
                </div>

                {/* Gallery if more images */}
                {article.images && article.images.length > 1 && (
                    <div className="mt-16 pt-12 border-t border-neutral-100">
                        <h3 className="text-2xl font-bold text-neutral-900 mb-8">Galeria</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {article.images.slice(1).map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Galeria ${idx}`}
                                    className="rounded-xl shadow-lg hover:shadow-2xl transition-shadow w-full h-64 object-cover"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Back Button Footer */}
                <div className="mt-16 pt-8 border-t border-neutral-200 flex justify-between items-center">
                    <button
                        onClick={() => navigate('/newsletter')}
                        className="flex items-center text-neutral-500 hover:text-success-700 font-bold transition-colors group"
                    >
                        <span className="transform group-hover:-translate-x-1 transition-transform inline-block mr-2">&larr;</span>
                        Voltar para Newsletter
                    </button>
                </div>
            </article>
        </div>
    );
};

export default ArticleDetails;
