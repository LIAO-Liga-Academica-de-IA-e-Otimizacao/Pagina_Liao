import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import type { Project } from '../../models/Project';
import CollectionLayout from '../layouts/CollectionLayout';

const Projects: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await apiService.getProjects({ sort: sortOrder });
                const data = Array.isArray(res.data.data) ? res.data.data : [];
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600"></div>
            </div>
        );
    }

    return (
        <CollectionLayout
            title="Projetos Realizados"
            renderControls={() => (
                <div className="flex bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-1">
                    <button
                        onClick={() => setSortOrder('recent')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${sortOrder === 'recent'
                            ? 'bg-primary-100 text-primary-600'
                            : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                            }`}
                    >
                        Recentes
                    </button>
                    <button
                        onClick={() => setSortOrder('oldest')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${sortOrder === 'oldest'
                            ? 'bg-primary-100 text-primary-600'
                            : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                            }`}
                    >
                        Antigos
                    </button>
                </div>
            )}
        >
            {(viewMode) => (
                <>
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className={`
                                group bg-white dark:bg-neutral-800 rounded-lg border border-neutral-100 dark:border-neutral-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer
                                ${viewMode === 'list' ? 'flex flex-row h-40' : 'flex flex-col h-full'}
                            `}
                        >
                            {/* Image Section */}
                            <div className={`
                                relative overflow-hidden bg-neutral-200
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
                                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
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
                                    <div className="text-sm text-primary-600 font-bold mb-2 uppercase tracking-wide">
                                        {new Date(project.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })}
                                    </div>
                                )}

                                <h3 className={`
                                    font-bold text-neutral-900 dark:text-white leading-tight group-hover:text-primary-600 transition-colors
                                    ${viewMode === 'grid' ? 'text-sm mb-1 line-clamp-2' : 'text-xl mb-3'}
                                `}>
                                    {project.title}
                                </h3>

                                {viewMode !== 'grid' && (
                                    <p className={`text-neutral-600 dark:text-neutral-400 line-clamp-3 flex-1 leading-relaxed text-sm ${viewMode === 'list' ? 'mb-2' : 'mb-6'}`}>
                                        {project.description}
                                    </p>
                                )}

                                {viewMode === 'grid' && (
                                    <div className="mt-2 text-xs text-neutral-400">
                                        {new Date(project.date).toLocaleDateString('pt-BR', { year: 'numeric' })}
                                    </div>
                                )}


                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-100">
                                    <span className="text-xs text-neutral-400 font-medium">
                                        LIAO
                                    </span>
                                    <button
                                        className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md active:transform active:scale-95"
                                    >
                                        Ler Mais
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {projects.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-neutral-600 text-lg">Nenhum projeto cadastrado no momento.</p>
                        </div>
                    )}
                </>
            )}
        </CollectionLayout>
    );
};

export default Projects;
