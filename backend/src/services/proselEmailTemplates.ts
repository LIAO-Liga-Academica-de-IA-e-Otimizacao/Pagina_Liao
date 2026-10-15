import { PROSEL_EVENT_LOCATION } from './proselBooking.constants';

function formatEventDate(eventDate: Date): string {
    return eventDate.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

interface BookingEmailInput {
    fullName: string;
    email: string;
    roomLabel: string;
    startTime: string;
    endTime: string;
    eventDate: Date;
}

export function candidateConfirmationEmail(booking: BookingEmailInput) {
    const dateStr = formatEventDate(booking.eventDate);
    return {
        subject: 'Confirmação de agendamento — Dinâmica Presencial ProSel LIAO',
        html: `
            <p>Olá, ${booking.fullName},</p>
            <p>Seu agendamento para a dinâmica presencial do Processo Seletivo da LIAO foi confirmado com sucesso.</p>
            <ul>
                <li><strong>Data:</strong> ${dateStr}</li>
                <li><strong>Sala:</strong> ${booking.roomLabel}</li>
                <li><strong>Horário:</strong> ${booking.startTime} às ${booking.endTime}</li>
                <li><strong>Local:</strong> ${PROSEL_EVENT_LOCATION}</li>
            </ul>
            <p>Por favor, compareça no local e horário agendados com antecedência.</p>
            <p>Atenciosamente,<br/>Equipe LIAO</p>
        `,
    };
}

export function adminBookingNotificationEmail(booking: BookingEmailInput) {
    const dateStr = formatEventDate(booking.eventDate);
    return {
        subject: `Nova inscrição confirmada — ${booking.roomLabel} — ProSel LIAO`,
        html: `
            <p>Uma nova inscrição foi confirmada para a dinâmica presencial do ProSel.</p>
            <ul>
                <li><strong>Candidato:</strong> ${booking.fullName}</li>
                <li><strong>Email:</strong> ${booking.email}</li>
                <li><strong>Sala:</strong> ${booking.roomLabel}</li>
                <li><strong>Horário:</strong> ${booking.startTime} às ${booking.endTime}</li>
                <li><strong>Data:</strong> ${dateStr}</li>
            </ul>
        `,
    };
}

interface RoomFullEmailInput {
    roomLabel: string;
    startTime: string;
    endTime: string;
    capacity: number;
    eventDate: Date;
    candidates: { fullName: string; email: string }[];
}

export function roomFullNotificationEmail(input: RoomFullEmailInput) {
    const dateStr = formatEventDate(input.eventDate);
    const rows = input.candidates
        .map((c) => `<li>${c.fullName} — ${c.email}</li>`)
        .join('');
    return {
        subject: `${input.roomLabel} esgotada — ProSel LIAO — ${dateStr}`,
        html: `
            <p><strong>${input.roomLabel}</strong> atingiu sua capacidade máxima.</p>
            <ul>
                <li><strong>Horário:</strong> ${input.startTime} às ${input.endTime}</li>
                <li><strong>Capacidade total:</strong> ${input.capacity} candidatos</li>
                <li><strong>Status:</strong> Todas as vagas preenchidas</li>
            </ul>
            <p><strong>Lista de inscritos:</strong></p>
            <ul>${rows}</ul>
        `,
    };
}
