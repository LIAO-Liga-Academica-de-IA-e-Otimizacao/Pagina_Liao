import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import type { EventApi } from '../../models/Event';
import type { Partner } from '../../models/Partner';

interface EventFormProps {
    event?: EventApi | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        title: event?.title || '',
        slug: event?.slug || '',
        description: event?.description || '',
        coverImage: event?.coverImage || '',
        date: event?.date ? new Date(event.date as string).toISOString().split('T')[0] : '',
        location: event?.location || '',
        speakers: (event?.speakers as any[]) || [],
        gallery: (event?.gallery as string[]) || [],
        highlights: (event?.highlights as string[]) || [],
        partners: (event?.partners as Partner[])?.map(p => p.id) || [] as number[]
    });

    const [allPartners, setAllPartners] = useState<Partner[]>([]);
    const [newSpeaker, setNewSpeaker] = useState('');
    const [newGalleryItem, setNewGalleryItem] = useState('');
    const [newHighlight, setNewHighlight] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await apiService.getPartners();
                setAllPartners(response.data || []);
            } catch (error) {
                console.error('Error fetching partners for selection:', error);
            }
        };
        fetchPartners();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (event && event.id !== undefined) {
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
        setFormData({ ...formData, [field]: [...(formData[field] as any[]), value] });
        setter('');
    };

    const removeItem = (field: 'speakers' | 'gallery' | 'highlights', index: number) => {
        const newList = [...(formData[field] as any[])];
        newList.splice(index, 1);
        setFormData({ ...formData, [field]: newList });
    };

    const togglePartner = (partnerId: number) => {
        const currentPartners = [...formData.partners];
        const index = currentPartners.indexOf(partnerId);
        if (index > -1) {
            currentPartners.splice(index, 1);
        } else {
            currentPartners.push(partnerId);
        }
        setFormData({ ...formData, partners: currentPartners });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-800 space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white border-b dark:border-neutral-800 pb-2">Informações Básicas</h3>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Título do Evento</label>
                        <input
                            type="text"
                            required
                            className="input-field w-full"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Slug (URL amigável)</label>
                        <input
                            type="text"
                            required
                            placeholder="ex: workshop-ia-2024"
                            className="input-field w-full"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Data</label>
                            <input
                                type="date"
                                required
                                className="input-field w-full"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Local</label>
                            <input
                                type="text"
                                placeholder="Auditório, Online, etc."
                                className="input-field w-full"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">URL da Imagem de Capa</label>
                        <input
                            type="url"
                            required
                            className="input-field w-full"
                            value={formData.coverImage}
                            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        />
                    </div>
                </div>

                {/* Description & Multi-fields */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white border-b dark:border-neutral-800 pb-2">Detalhes e Mídia</h3>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Descrição</label>
                        <textarea
                            rows={4}
                            required
                            className="input-field w-full"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Speakers */}
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Palestrantes</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                className="input-field flex-1"
                                value={newSpeaker}
                                onChange={(e) => setNewSpeaker(e.target.value)}
                                placeholder="Nome do palestrante"
                            />
                            <button type="button" onClick={() => addItem('speakers', newSpeaker, setNewSpeaker)} className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl font-bold hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">+</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.speakers.map((s, i) => (
                                <span key={i} className="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-lg text-sm flex items-center gap-2 border dark:border-primary-800">
                                    {s}
                                    <button type="button" onClick={() => removeItem('speakers', i)} className="hover:text-danger-500 transition-colors">×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Highlights */}
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Destaques (Bullet points)</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                className="input-field flex-1"
                                value={newHighlight}
                                onChange={(e) => setNewHighlight(e.target.value)}
                                placeholder="O que terá no evento?"
                            />
                            <button type="button" onClick={() => addItem('highlights', newHighlight, setNewHighlight)} className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl font-bold hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">+</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.highlights.map((h, i) => (
                                <span key={i} className="bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 px-3 py-1 rounded-lg text-sm flex items-center gap-2 border dark:border-success-800">
                                    {h}
                                    <button type="button" onClick={() => removeItem('highlights', i)} className="hover:text-danger-500 transition-colors">×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Gallery */}
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Galeria (Fotos Extras - URLs)</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="url"
                                className="input-field flex-1"
                                value={newGalleryItem}
                                onChange={(e) => setNewGalleryItem(e.target.value)}
                                placeholder="URL da foto"
                            />
                            <button type="button" onClick={() => addItem('gallery', newGalleryItem, setNewGalleryItem)} className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl font-bold hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">+</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.gallery.map((img, i) => (
                                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border">
                                    <img src={img} alt="Gallery item" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => removeItem('gallery', i)} className="absolute inset-0 bg-danger-500/80 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">×</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Partners Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Parceiros do Evento</label>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border dark:border-neutral-800 rounded-xl">
                            {allPartners.length > 0 ? (
                                allPartners.map((partner) => (
                                    <div 
                                        key={partner.id} 
                                        onClick={() => togglePartner(partner.id)}
                                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors border ${
                                            formData.partners.includes(partner.id) 
                                                ? 'bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800' 
                                                : 'bg-white border-transparent hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800'
                                        }`}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                            formData.partners.includes(partner.id) 
                                                ? 'bg-primary-600 border-primary-600' 
                                                : 'border-neutral-300 dark:border-neutral-700'
                                        }`}>
                                            {formData.partners.includes(partner.id) && (
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <img src={partner.imageUrl} alt="" className="w-6 h-6 object-contain rounded" />
                                        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate">{partner.name}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-neutral-500 col-span-2 py-2">Nenhum parceiro cadastrado.</p>
                            )}
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-2">Os parceiros selecionados aparecerão na página deste evento.</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t font-bold">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-8 py-3 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-12 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 disabled:opacity-50"
                >
                    {loading ? 'Salvando...' : event ? 'Atualizar Evento' : 'Criar Evento'}
                </button>
            </div>
        </form>
    );
};

export default EventForm;
