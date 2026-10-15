import { Request, Response } from 'express';
import { ProSelRoom } from '@prisma/client';
import {
    getAvailability,
    createBooking,
    listBookings,
    resendBookingEmails,
    resendRoomFullNotification,
    RoomFullError,
    DuplicateBookingError,
    InvalidRoomError,
} from '../services/proselBookingService';
import { PROSEL_EVENT_DATE, PROSEL_EVENT_LOCATION } from '../services/proselBooking.constants';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @openapi
 * /api/prosel/availability:
 *   get:
 *     summary: getProSelAvailability operation
 *     tags: [Prosel]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
export const getProSelAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
        const rooms = await getAvailability();
        res.json({
            success: true,
            data: {
                eventDate: PROSEL_EVENT_DATE,
                location: PROSEL_EVENT_LOCATION,
                rooms,
            },
        });
    } catch (error) {
        console.error('Get ProSel availability error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch availability' });
    }
};

/**
 * @openapi
 * /api/prosel/bookings:
 *   post:
 *     summary: createProSelBooking operation
 *     tags: [Prosel]
 *     responses:
 *       201:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
export const createProSelBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, email, room } = req.body;

        if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
            res.status(400).json({ success: false, error: 'Nome completo é obrigatório' });
            return;
        }
        if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
            res.status(400).json({ success: false, error: 'Email inválido' });
            return;
        }
        if (!room || !Object.values(ProSelRoom).includes(room)) {
            res.status(400).json({ success: false, error: 'Sala inválida' });
            return;
        }

        const booking = await createBooking({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            room,
        });

        res.status(201).json({
            success: true,
            data: {
                booking: {
                    id: booking.id,
                    fullName: booking.fullName,
                    email: booking.email,
                    room: booking.room,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    eventDate: booking.eventDate,
                },
            },
            message: 'Agendamento confirmado com sucesso',
        });
    } catch (error) {
        if (error instanceof RoomFullError) {
            res.status(409).json({ success: false, error: 'Esta sala não possui mais vagas disponíveis' });
            return;
        }
        if (error instanceof DuplicateBookingError) {
            res.status(409).json({
                success: false,
                error: 'Este email já possui um agendamento confirmado para este evento',
            });
            return;
        }
        if (error instanceof InvalidRoomError) {
            res.status(400).json({ success: false, error: 'Sala inválida' });
            return;
        }
        console.error('Create ProSel booking error:', error);
        res.status(500).json({ success: false, error: 'Failed to create booking' });
    }
};

/**
 * @openapi
 * /api/prosel/bookings:
 *   get:
 *     summary: getProSelBookings operation
 *     tags: [Prosel]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
export const getProSelBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookings = await listBookings();
        res.json({ success: true, data: { bookings } });
    } catch (error) {
        console.error('List ProSel bookings error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
    }
};

/**
 * @openapi
 * /api/prosel/bookings/{id}/resend-email:
 *   post:
 *     summary: resendProSelBookingEmail operation
 *     tags: [Prosel]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */
export const resendProSelBookingEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        await resendBookingEmails(id);
        res.json({ success: true, message: 'Email resend attempted' });
    } catch (error) {
        console.error('Resend ProSel booking email error:', error);
        res.status(500).json({ success: false, error: 'Failed to resend email' });
    }
};

/**
 * @openapi
 * /api/prosel/room-notifications/{room}/resend:
 *   post:
 *     summary: resendProSelRoomFullNotification operation
 *     tags: [Prosel]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */
export const resendProSelRoomFullNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        const room = req.params.room as ProSelRoom;
        if (!Object.values(ProSelRoom).includes(room)) {
            res.status(400).json({ success: false, error: 'Sala inválida' });
            return;
        }
        await resendRoomFullNotification(room);
        res.json({ success: true, message: 'Notification resend attempted' });
    } catch (error) {
        if (error instanceof InvalidRoomError) {
            res.status(400).json({ success: false, error: 'Esta sala ainda não está esgotada' });
            return;
        }
        console.error('Resend ProSel room-full notification error:', error);
        res.status(500).json({ success: false, error: 'Failed to resend notification' });
    }
};
