import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import TutorCard from '../../components/domain/TutorCard';
import type { Tutor } from '../../models/Tutor';
import PageLayout from '../layouts/PageLayout';

const Tutors: React.FC = () => {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const response = await apiService.getTutors();
                // Ensure we handle the response structure correctly
                const data = (response.success && (response.data?.tutors || response.data)) || [];
                setTutors(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setError('Erro ao carregar tutores. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchTutors();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-danger-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <PageLayout>
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-6 text-center">
                    <p className="text-danger-800">{error}</p>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout
            title="Nossos Tutores"
            subtitle="Nossos tutores estão prontos para ajudar você"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tutors.map((tutor) => (
                    <TutorCard key={tutor.id} tutor={tutor} />
                ))}
            </div>

            {tutors.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
                    <p className="text-neutral-500 dark:text-neutral-400 text-lg">
                        Nenhum tutor disponível no momento.
                    </p>
                </div>
            )}
        </PageLayout>
    );
};

export default Tutors;
