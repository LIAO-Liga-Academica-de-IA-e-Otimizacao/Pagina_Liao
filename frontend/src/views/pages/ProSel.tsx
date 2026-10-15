import React, { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../../services/api';
import Button from '../../components/ui/Button';

interface RoomAvailability {
    room: string;
    label: string;
    startTime: string;
    endTime: string;
    capacity: number;
    bookedCount: number;
    remaining: number;
    available: boolean;
}

interface AvailabilityResponse {
    eventDate: string;
    location: string;
    rooms: RoomAvailability[];
}

const POLL_INTERVAL_MS = 15000;

function formatEventDate(isoDate: string): string {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
}

const ProSel: React.FC = () => {
    const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
    const [loadingAvailability, setLoadingAvailability] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<RoomAvailability | null>(null);
    const [step, setStep] = useState<'rooms' | 'form' | 'summary' | 'success'>('rooms');
    const [formData, setFormData] = useState({ fullName: '', email: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [confirmedBooking, setConfirmedBooking] = useState<{
        fullName: string;
        room: string;
        startTime: string;
        endTime: string;
    } | null>(null);

    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchAvailability = useCallback(async () => {
        try {
            const response = await apiService.getProSelAvailability();
            setAvailability(response.data);
        } catch (err) {
            console.error('Error fetching ProSel availability:', err);
        } finally {
            setLoadingAvailability(false);
        }
    }, []);

    useEffect(() => {
        fetchAvailability();
        pollRef.current = setInterval(fetchAvailability, POLL_INTERVAL_MS);
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [fetchAvailability]);

    const handleSelectRoom = (room: RoomAvailability) => {
        setSelectedRoom(room);
        setError('');
        setStep('form');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGoToSummary = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('summary');
    };

    const handleConfirm = async () => {
        if (!selectedRoom) return;
        setSubmitting(true);
        setError('');

        try {
            const response = await apiService.createProSelBooking({
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                room: selectedRoom.room,
            });
            const booking = response.data.booking;
            setConfirmedBooking({
                fullName: booking.fullName,
                room: selectedRoom.label,
                startTime: booking.startTime,
                endTime: booking.endTime,
            });
            setStep('success');
        } catch (err: any) {
            const message = err.response?.data?.error || 'Erro ao confirmar o agendamento. Tente novamente.';
            setError(message);
            // The room may have filled up or the email may have just been taken
            // while the candidate was filling the form — refresh so the UI
            // reflects reality instead of showing a stale "available" state.
            fetchAvailability();
            setStep('rooms');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRestart = () => {
        setSelectedRoom(null);
        setFormData({ fullName: '', email: '' });
        setConfirmedBooking(null);
        setError('');
        setStep('rooms');
        fetchAvailability();
    };

    if (loadingAvailability) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 page-padding-y">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="section-title">Agendamento da Dinâmica Presencial — ProSel LIAO</h1>
                    {availability && (
                        <p className="text-xl text-neutral-600 dark:text-neutral-400">
                            {formatEventDate(availability.eventDate)} · {availability.location}
                        </p>
                    )}
                </div>

                {error && step === 'rooms' && (
                    <div className="mb-6 p-4 bg-danger-50 dark:bg-danger-950/30 border border-danger-200 dark:border-danger-800 rounded-lg">
                        <p className="text-danger-800 dark:text-danger-300">{error}</p>
                    </div>
                )}

                {step === 'rooms' && availability && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {availability.rooms.map((room) => (
                            <div key={room.room} className="card p-6 flex flex-col">
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
                                    {room.label} — {room.startTime} às {room.endTime}
                                </h3>
                                <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1 my-4">
                                    <p>Capacidade total: {room.capacity} candidatos</p>
                                    <p>Vagas ocupadas: {room.bookedCount}</p>
                                    <p>Vagas restantes: {room.remaining}</p>
                                    <p className={room.available ? 'text-success-700 dark:text-success-400 font-medium' : 'text-danger-700 dark:text-danger-400 font-bold'}>
                                        Status: {room.available ? 'Disponível' : 'Indisponível — sem vagas'}
                                    </p>
                                </div>
                                <Button
                                    variant="special"
                                    className="mt-auto w-full"
                                    disabled={!room.available}
                                    onClick={() => handleSelectRoom(room)}
                                >
                                    {room.available ? 'Selecionar esta sala' : 'Sem vagas'}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {step === 'form' && selectedRoom && (
                    <div className="card p-8">
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
                            {selectedRoom.label} — {selectedRoom.startTime} às {selectedRoom.endTime}
                        </h3>
                        <form onSubmit={handleGoToSummary} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                    Email utilizado no Processo Seletivo *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>
                            <div className="flex gap-4">
                                <Button type="button" variant="outline" onClick={handleRestart} className="flex-1">
                                    Voltar
                                </Button>
                                <Button type="submit" variant="special" className="flex-1">
                                    Revisar agendamento
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {step === 'summary' && selectedRoom && availability && (
                    <div className="card p-8">
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
                            Confirme seu agendamento
                        </h3>

                        {error && (
                            <div className="mb-6 p-4 bg-danger-50 dark:bg-danger-950/30 border border-danger-200 dark:border-danger-800 rounded-lg">
                                <p className="text-danger-800 dark:text-danger-300">{error}</p>
                            </div>
                        )}

                        <dl className="space-y-3 mb-8 text-neutral-700 dark:text-neutral-300">
                            <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-700 pb-2">
                                <dt className="font-medium">Nome</dt>
                                <dd>{formData.fullName}</dd>
                            </div>
                            <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-700 pb-2">
                                <dt className="font-medium">Email</dt>
                                <dd>{formData.email}</dd>
                            </div>
                            <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-700 pb-2">
                                <dt className="font-medium">Data</dt>
                                <dd>{formatEventDate(availability.eventDate)}</dd>
                            </div>
                            <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-700 pb-2">
                                <dt className="font-medium">Sala</dt>
                                <dd>{selectedRoom.label}</dd>
                            </div>
                            <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-700 pb-2">
                                <dt className="font-medium">Horário</dt>
                                <dd>{selectedRoom.startTime} às {selectedRoom.endTime}</dd>
                            </div>
                            <div className="flex justify-between pb-2">
                                <dt className="font-medium">Local</dt>
                                <dd>{availability.location}</dd>
                            </div>
                        </dl>

                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep('form')}
                                className="flex-1"
                                disabled={submitting}
                            >
                                Editar
                            </Button>
                            <Button
                                type="button"
                                variant="special"
                                onClick={handleConfirm}
                                loading={submitting}
                                className="flex-1"
                            >
                                Confirmar agendamento
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'success' && confirmedBooking && (
                    <div className="card p-12 text-center">
                        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-success-100 dark:bg-success-900/30 mb-6">
                            <svg className="h-12 w-12 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                            Agendamento confirmado!
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto mb-2">
                            {confirmedBooking.fullName}, seu horário na {confirmedBooking.room} ({confirmedBooking.startTime} às {confirmedBooking.endTime}) foi confirmado.
                        </p>
                        <p className="text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto mb-8">
                            Você receberá um email de confirmação com os detalhes. Compareça ao PAF 1 — UFBA no horário agendado.
                        </p>
                        <Button variant="primary" onClick={handleRestart}>
                            Voltar ao início
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProSel;
