import React, { useState } from 'react';
import { apiService } from '../../services/api';
import type { Article } from '../../models/Article';

interface ArticleFormProps {
    article?: Article;
    onSuccess: () => void;
    onCancel: () => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ article, onSuccess, onCancel }) => {
    const [title, setTitle] = useState(article?.title || '');
    const [description, setDescription] = useState(article?.description || '');
    const [content, setContent] = useState(article?.content || '');
    const [images, setImages] = useState<string[]>(article?.images || ['']);
    const [tagsInput, setTagsInput] = useState(article?.tags?.join(', ') || '');
    const [isPublished, setIsPublished] = useState(article?.isPublished !== false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...images];
        newImages[index] = value;
        setImages(newImages);
    };

    const addImageField = () => {
        if (images.length < 5) {
            setImages([...images, '']);
        }
    };

    const removeImageField = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const filteredImages = images.filter(img => img.trim() !== '');

        // Process tags: split by comma, trim whitespace, remove empty str
        const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(t => t !== '');

        if (filteredImages.length > 5) {
            setError('Máximo de 5 imagens por artigo/newsletter.');
            setLoading(false);
            return;
        }

        const data = {
            title,
            description,
            content,
            images: filteredImages,
            tags: tagsArray,
            isPublished
        };

        try {
            if (article) {
                await apiService.updateArticle(article.id, data);
            } else {
                await apiService.createArticle(data);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao salvar artigo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-neutral-800">
                {article ? 'Editar Artigo/Newsletter' : 'Nova Publicação'}
            </h2>

            {error && (
                <div className="mb-4 p-4 bg-danger-50 border border-danger-200 rounded text-danger-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Título</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="input-field mt-1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-700">Descrição / Resumo (Aparece no Card)</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="input-field mt-1"
                        placeholder="Breve resumo para atrair leitores..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-700">Conteúdo Completo (Aparece ao clicar)</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={6}
                        className="input-field mt-1"
                        placeholder="Escreva o conteúdo da notícia ou artigo aqui..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-700">Tags (Separadas por vírgula)</label>
                    <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="Ex: Eventos, IA, Tecnologia"
                        className="input-field mt-1"
                    />
                </div>

                <div className="flex items-center mt-4">
                    <input
                        type="checkbox"
                        id="isPublished"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="h-4 w-4 text-success-600 focus:ring-success-500 border-neutral-300 rounded"
                    />
                    <label htmlFor="isPublished" className="ml-2 block text-sm text-neutral-900">
                        Publicado (Visível no site)
                    </label>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Imagens (Max 5)
                        <span className="text-xs text-neutral-500 ml-2">Cole as URLs das imagens</span>
                    </label>

                    {images.map((img, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="url"
                                value={img}
                                onChange={(e) => handleImageChange(index, e.target.value)}
                                placeholder="https://exemplo.com/imagem.jpg"
                                className="input-field flex-1"
                            />
                            {images.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeImageField(index)}
                                    className="px-3 py-2 bg-danger-100 text-danger-600 rounded hover:bg-danger-200"
                                >
                                    X
                                </button>
                            )}
                        </div>
                    ))}

                    {images.length < 5 && (
                        <button
                            type="button"
                            onClick={addImageField}
                            className="mt-2 text-sm text-primary-600 hover:text-primary-800 font-medium"
                        >
                            + Adicionar outra imagem
                        </button>
                    )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? 'Salvando...' : 'Salvar Publicação'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ArticleForm;
