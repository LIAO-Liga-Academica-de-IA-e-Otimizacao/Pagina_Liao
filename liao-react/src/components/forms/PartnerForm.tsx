import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import type { Partner } from '../../models/Partner';

interface PartnerFormProps {
    partner?: Partner | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const PartnerForm: React.FC<PartnerFormProps> = ({ partner, onSuccess, onCancel }) => {
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (partner) {
            setName(partner.name);
            setImageUrl(partner.imageUrl);
            setWebsiteUrl(partner.websiteUrl || '');
        }
    }, [partner]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = { name, imageUrl, websiteUrl };


            if (partner && partner.id) {
                // Update implementation
                await apiService.updatePartner(partner.id, data);
            } else {
                await apiService.createPartner(data);
            }

            onSuccess();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'Erro ao salvar parceria.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-6 border dark:border-neutral-800">
            <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-white">
                {partner ? 'Editar Parceria' : 'Nova Parceria'}
            </h2>

            {error && (
                <div className="bg-danger-50 text-danger-600 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Nome da Parceria/Empresa</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field mt-1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-700">URL da Imagem (Logo)</label>
                    <input
                        type="url"
                        required
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://exemplo.com/logo.png"
                        className="input-field mt-1"
                    />
                    <p className="text-xs text-neutral-500 mt-1">Cole o link da imagem da logo.</p>
                </div>

                {imageUrl && (
                    <div className="mt-2">
                        <p className="text-xs text-neutral-500 mb-1">Preview:</p>
                        <img src={imageUrl} alt="Preview" className="h-16 object-contain border rounded p-1" />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-neutral-700">Link do Site (Opcional)</label>
                    <input
                        type="url"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://parceiro.com"
                        className="input-field mt-1"
                    />
                    <p className="text-xs text-neutral-500 mt-1">Link para onde o usuário será redirecionado ao clicar.</p>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PartnerForm;
