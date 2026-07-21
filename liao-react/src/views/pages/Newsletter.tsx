import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import type { Article } from '../../models/Article';
import CollectionLayout from '../layouts/CollectionLayout';
import MemberModal from '../../components/ui/MemberModal';
import { FaHeart, FaShareAlt } from 'react-icons/fa';

const Newsletter: React.FC = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMember, setSelectedMember] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const handleShareCard = (e: React.MouseEvent, articleId: number) => {
        e.stopPropagation();
        const url = `${window.location.origin}/newsletter/${articleId}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Artigo LIAO',
                url: url
            }).catch(err => console.log('Error sharing:', err));
        } else {
            navigator.clipboard.writeText(url).then(() => {
                setCopiedId(articleId);
                setTimeout(() => setCopiedId(null), 2000);
            }).catch(err => console.error('Failed to copy link:', err));
        }
    };

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await apiService.getArticles();
                const data = (res.success && Array.isArray(res.data)) ? res.data : [];
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
            <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600"></div>
            </div>
        );
    }

    return (
        <>
        <CollectionLayout
            title="Newsletter & Artigos"
            renderControls={() => (
                <div className="w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 text-sm placeholder-neutral-500 dark:placeholder-neutral-400 transition-colors"
                    />
                </div>
            )}
        >
            {(viewMode) => (
                <>
                    {filteredArticles.map((article) => (
                        <div
                            key={article.id}
                            onClick={() => navigate(`/newsletter/${article.id}`)}
                            className={`
                                group bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer
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
                                    ${viewMode === 'grid' ? 'mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-700' : 'mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-700'}
                                `}>
                                    {/* Author Info */}
                                    {(article.authorMember || article.authorName) && (
                                        <div className="flex items-center text-[11px] text-neutral-500 dark:text-neutral-400 font-medium mb-2">
                                            <span className="mr-1 text-[9px] uppercase text-neutral-400 dark:text-neutral-500">Por:</span>
                                            {article.authorMember ? (
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedMember(article.authorMember);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 hover:underline cursor-pointer"
                                                >
                                                    {article.authorMember.name}
                                                </span>
                                            ) : (
                                                <span className="font-bold text-neutral-700 dark:text-neutral-300">
                                                    {article.authorName}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                                                {new Date(article.createdAt).toLocaleDateString('pt-BR')}
                                            </span>
                                            <div className="flex items-center gap-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                                                <FaHeart size={10} className="text-danger-500 dark:text-danger-400" />
                                                <span>{article.likes || 0}</span>
                                            </div>
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => handleShareCard(e, article.id)}
                                                    className="p-1 rounded-full text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all focus:outline-none"
                                                    title="Compartilhar Artigo"
                                                >
                                                    <FaShareAlt size={10} />
                                                </button>
                                                {copiedId === article.id && (
                                                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-neutral-900 text-white text-[9px] font-bold rounded shadow-lg animate-in fade-in duration-200 z-30 pointer-events-none whitespace-nowrap">
                                                        Copiado!
                                                    </span>
                                                )}
                                            </div>
                                        </div>
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
                        </div>
                    ))}

                    {filteredArticles.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                                {searchTerm ? 'Nenhum resultado encontrado.' : 'Nenhuma notícia publicada ainda.'}
                            </p>
                        </div>
                    )}
                </>
            )}
        </CollectionLayout>

        <MemberModal
            member={selectedMember}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
        />
        </>
    );
};

export default Newsletter;
