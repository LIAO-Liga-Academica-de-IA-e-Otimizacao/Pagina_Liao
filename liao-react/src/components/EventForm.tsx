import React, { useState } from 'react';
import { apiService } from '../services/api';
import type { Event } from '../models/Event';

interface EventFormProps {
    event?: Event | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        title: event?.title || '',
        slug: event?.slug || '',
        description: event?.description || '',
        coverImage: event?.coverImage || '',
        date: event?.date ? new Date(event.date).toISOString().split('T')[0] : '',
        location: event?.location || '',
        speakers: event?.speakers || [],
        gallery: event?.gallery || [],
        highlights: event?.highlights || []
    });

    const [newSpeaker, setNewSpeaker] = useState('');
    const [newGalleryItem, setNewGalleryItem] = useState('');
    const [newHighlight, setNewHighlight] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (event) {
                await apiService.updateEvent(event.id, formData);
            } else {
                await apiService.createEvent(formData);
            }
            onSuccess();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.error || 'Erro ao salvar evento');
        } finally {
            setLoading(false);
        }
    };

    const addItem = (field: 'speakers' | 'gallery' | 'highlights', value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
        if (!value.trim()) return;
        setFormData({ ...formData, [field]: [...formData[field], value] });
        setter('');
    };

    const removeItem = (field: 'speakers' | 'gallery' | 'highlights', index: number) => {
        const newList = [...formData[field]];
        newList.splice(index, 1);
        setFormData({ ...formData, [field]: newList });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Informações Básicas</h3>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Título do Evento</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (URL amigável)</label>
                        <input
                            type="text"
                            required
                            placeholder="ex: workshop-ia-2024"
                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Data</label>
                            <input
                                type="date"
                                required
                                className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Local</label>
                            <input
                                type="text"
                                placeholder="Auditório, Online, etc."
                                className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">URL da Imagem de Capa</label>
                        <input
                            type="url"
                            required
                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                            value={formData.coverImage}
                            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        />
                    </div>
                </div>

                {/* Description & Multi-fields */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Detalhes e Mídia</h3>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição</label>
                        <textarea
                            rows={4}
                            required
                            className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Speakers */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Palestrantes</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                className="flex-1 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                value={newSpeaker}
                                onChange={(e) => setNewSpeaker(e.target.value)}
                                placeholder="Nome do palestrante"
                            />
                            <button type="button" onClick={() => addItem('speakers', newSpeaker, setNewSpeaker)} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors">+</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.speakers.map((s, i) => (
                                <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm flex items-center gap-2">
                                    {s}
                                    <button type="button" onClick={() => removeItem('speakers', i)} className="hover:text-red-500">×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Highlights */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Destaques (Bullet points)</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                className="flex-1 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                value={newHighlight}
                                onChange={(e) => setNewHighlight(e.target.value)}
                                placeholder="O que terá no evento?"
                            />
                            <button type="button" onClick={() => addItem('highlights', newHighlight, setNewHighlight)} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors">+</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.highlights.map((h, i) => (
                                <span key={i} className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm flex items-center gap-2">
                                    {h}
                                    <button type="button" onClick={() => removeItem('highlights', i)} className="hover:text-red-500">×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Gallery */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Galeria (Fotos Extras - URLs)</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="url"
                                className="flex-1 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                value={newGalleryItem}
                                onChange={(e) => setNewGalleryItem(e.target.value)}
                                placeholder="URL da foto"
                            />
                            <button type="button" onClick={() => addItem('gallery', newGalleryItem, setNewGalleryItem)} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors">+</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.gallery.map((img, i) => (
                                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border">
                                    <img src={img} alt="Gallery item" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => removeItem('gallery', i)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t font-bold">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-8 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-12 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50"
                >
                    {loading ? 'Salvando...' : event ? 'Atualizar Evento' : 'Criar Evento'}
                </button>
            </div>
        </form>
    );
};

export default EventForm;
