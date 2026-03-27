import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import type { Project } from '../../models/Project';

const Projects: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');
    const [viewMode, setViewMode] = useState<'card' | 'list' | 'grid'>('card');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await apiService.getProjects({ sort: sortOrder });
                const data = (res.success && Array.isArray(res.data)) ? res.data : [];
                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [sortOrder]);

    const getContainerClass = () => {
        switch (viewMode) {
            case 'list': return 'flex flex-col gap-4';
            case 'grid': return 'grid grid-cols-2 md:grid-cols-4 gap-4';
            default: return 'grid grid-cols-1 md:grid-cols-3 gap-8';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-12 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
                    <h1 className="section-title mb-4 md:mb-0 dark:text-white">Projetos Realizados</h1>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        {/* Sort Buttons */}
                        <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-1">
                            <button
                                onClick={() => setSortOrder('recent')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${sortOrder === 'recent'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                Recentes
                            </button>
                            <button
                                onClick={() => setSortOrder('oldest')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${sortOrder === 'oldest'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                Antigos
                            </button>
                        </div>

                        {/* View Switcher */}
                        <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-1">
                            <button
                                onClick={() => setViewMode('card')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'card' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                title="Visualização em Cards"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                title="Visualização em Lista"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                title="Grid Compacto"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={getContainerClass()}>
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className={`
                                group bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer
                                ${viewMode === 'list' ? 'flex flex-row h-40' : 'flex flex-col h-full'}
                            `}
                        >
                            {/* Image Section */}
                            <div className={`
                                relative overflow-hidden bg-gray-200
                                ${viewMode === 'list' ? 'w-48 shrink-0' : ''}
                                ${viewMode === 'grid' ? 'h-48' : ''}
                                ${viewMode === 'card' ? 'h-56' : ''}
                            `}>
                                {project.images && project.images.length > 0 ? (
                                    <>
                                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity z-10" />
                                        <img
                                            src={project.images[0]}
                                            alt={project.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                        Sem imagem
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className={`
                                flex flex-col
                                ${viewMode === 'list' ? 'p-4 justify-between flex-1' : 'p-6 flex-1'}
                                ${viewMode === 'grid' ? 'p-3' : ''}
                            `}>
                                {(viewMode === 'card' || viewMode === 'list') && (
                                    <div className="text-sm text-blue-600 font-bold mb-2 uppercase tracking-wide">
                                        {new Date(project.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })}
                                    </div>
                                )}

                                <h3 className={`
                                    font-bold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors
                                    ${viewMode === 'grid' ? 'text-sm mb-1 line-clamp-2' : 'text-xl mb-3'}
                                `}>
                                    {project.title}
                                </h3>

                                {viewMode !== 'grid' && (
                                    <p className={`text-gray-600 dark:text-gray-400 line-clamp-3 flex-1 leading-relaxed text-sm ${viewMode === 'list' ? 'mb-2' : 'mb-6'}`}>
                                        {project.description}
                                    </p>
                                )}

                                {viewMode === 'grid' && (
                                    <div className="mt-2 text-xs text-gray-400">
                                        {new Date(project.date).toLocaleDateString('pt-BR', { year: 'numeric' })}
                                    </div>
                                )}


                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-xs text-gray-400 font-medium">
                                        LIAO
                                    </span>
                                    <button
                                        className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md active:transform active:scale-95"
                                    >
                                        Ler Mais
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">Nenhum projeto cadastrado no momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Projects;
