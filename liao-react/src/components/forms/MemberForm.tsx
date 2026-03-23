import React, { useState } from 'react';
import { apiService } from '../../services/api';

interface MemberFormProps {
    member?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ member, onSuccess, onCancel }) => {
    const [name, setName] = useState(member?.name || '');
    const [email, setEmail] = useState(member?.email || '');
    const [role, setRole] = useState(member?.role || 'member');
    const [isFounder, setIsFounder] = useState(member?.isFounder || false);
    const [year, setYear] = useState(member?.year || 2026);
    const [isActive, setIsActive] = useState(member?.isActive !== false); // Default to true if undefined
    const [course, setCourse] = useState(member?.course || '');
    const [bio, setBio] = useState(member?.bio || '');
    const [photo, setPhoto] = useState(member?.photo || '');
    const [linkedin, setLinkedin] = useState(member?.linkedin || '');
    const [github, setGithub] = useState(member?.github || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = {
            name,
            email,
            role,
            isFounder,
            year,
            isActive,
            course,
            bio,
            photo,
            linkedin,
            github,
        };

        try {
            if (member) {
                await apiService.updateMember(member.id, data);
            } else {
                await apiService.createMember(data);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao salvar membro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {member ? 'Editar Membro' : 'Novo Membro'}
            </h2>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="input-field mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field mt-1"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Curso</label>
                    <input
                        type="text"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        placeholder="Ex: Engenharia de Computação"
                        className="input-field mt-1"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Função</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="input-field"
                        >
                            <option value="member">Membro</option>
                            <option value="Diretor Geral">Diretor Geral</option>
                            <option value="Vice Diretor">Vice Diretor</option>
                            <option value="Dir. Secretaria Geral">Dir. Secretaria Geral</option>
                            <option value="Dir. Acadêmica">Dir. Acadêmica</option>
                            <option value="Dir. Relações Públicas">Dir. Relações Públicas</option>
                            <option value="Dir. Extensão">Dir. Extensão</option>
                            <option value="Dir. Científico">Dir. Científico</option>
                        </select>
                    </div>
                    <div className="flex items-center mt-6">
                        <input
                            type="checkbox"
                            id="isFounder"
                            checked={isFounder}
                            onChange={(e) => setIsFounder(e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isFounder" className="ml-2 block text-sm text-gray-900">
                            Membro Fundador (Selo Especial)
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Foto URL</label>
                    <input
                        type="url"
                        value={photo}
                        onChange={(e) => setPhoto(e.target.value)}
                        placeholder="https://..."
                        className="input-field mt-1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="input-field mt-1"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ano de Ingresso/Vigência</label>
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            className="input-field mt-1"
                        />
                    </div>
                    <div className="flex items-center mt-6">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                            Membro Vigente/Ativo (Exibe na aba Diretoria/Membros do ano)
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                        <input
                            type="url"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            className="input-field mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                        <input
                            type="url"
                            value={github}
                            onChange={(e) => setGithub(e.target.value)}
                            className="input-field mt-1"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? 'Salvando...' : 'Salvar Membro'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MemberForm;
