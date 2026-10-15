import { Prisma, ProSelRoom } from '@prisma/client';
import prisma from '../config/database';
import { sendMail } from './mailer';
import {
    candidateConfirmationEmail,
    adminBookingNotificationEmail,
    roomFullNotificationEmail,
} from './proselEmailTemplates';
import { PROSEL_EVENT_DATE } from './proselBooking.constants';

export class RoomFullError extends Error {
    constructor() {
        super('Room is already at full capacity');
        this.name = 'RoomFullError';
    }
}

export class DuplicateBookingError extends Error {
    constructor() {
        super('This email already has a booking for this event');
        this.name = 'DuplicateBookingError';
    }
}

export class InvalidRoomError extends Error {
    constructor() {
        super('Invalid room');
        this.name = 'InvalidRoomError';
    }
}

export async function getAvailability() {
    const rooms = await prisma.proSelRoomCapacity.findMany({
        orderBy: { room: 'asc' },
    });

    return rooms.map((room) => ({
        room: room.room,
        label: room.label,
        startTime: room.startTime,
        endTime: room.endTime,
        capacity: room.capacity,
        bookedCount: room.bookedCount,
        remaining: Math.max(room.capacity - room.bookedCount, 0),
        available: room.bookedCount < room.capacity,
    }));
}

interface CreateBookingInput {
    fullName: string;
    email: string;
    room: string;
}

/**
 * Creates a booking with two guarantees enforced at the DB level (not just
 * in this function): a unique constraint on email blocks duplicate active
 * bookings, and a conditional `updateMany` (bookedCount < capacity) only
 * increments the counter when a slot is actually still free. Both run
 * inside one transaction, so a capacity breach rolls back the insert too —
 * concurrent requests for the last seat cannot both succeed.
 */
export async function createBooking(input: CreateBookingInput) {
    const room = input.room as ProSelRoom;
    if (!Object.values(ProSelRoom).includes(room)) {
        throw new InvalidRoomError();
    }

    const result = await prisma.$transaction(async (tx) => {
        const roomCapacity = await tx.proSelRoomCapacity.findUniqueOrThrow({ where: { room } });

        let booking;
        try {
            booking = await tx.proSelBooking.create({
                data: {
                    fullName: input.fullName,
                    email: input.email,
                    room,
                    eventDate: new Date(PROSEL_EVENT_DATE),
                    startTime: roomCapacity.startTime,
                    endTime: roomCapacity.endTime,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new DuplicateBookingError();
            }
            throw error;
        }

        // Conditional update: only increments if a seat is still free. Postgres
        // locks the matched row for the duration of the UPDATE, so concurrent
        // transactions racing for the last seat serialize here instead of both
        // reading a stale `bookedCount` and over-committing the room.
        const guardedUpdate = await tx.proSelRoomCapacity.updateMany({
            where: { room, bookedCount: { lt: roomCapacity.capacity } },
            data: { bookedCount: { increment: 1 } },
        });

        if (guardedUpdate.count === 0) {
            throw new RoomFullError();
        }

        const afterUpdate = await tx.proSelRoomCapacity.findUniqueOrThrow({ where: { room } });
        let justFilled = false;
        if (afterUpdate.bookedCount >= afterUpdate.capacity && !afterUpdate.fullNotifiedAt) {
            await tx.proSelRoomCapacity.update({
                where: { room },
                data: { fullNotifiedAt: new Date() },
            });
            justFilled = true;
        }

        return { booking, justFilled };
    });

    await sendBookingEmails(result.booking);

    if (result.justFilled) {
        await sendRoomFullNotification(room);
    }

    return result.booking;
}

async function sendBookingEmails(booking: {
    id: number;
    fullName: string;
    email: string;
    room: ProSelRoom;
    startTime: string;
    endTime: string;
    eventDate: Date;
}) {
    const roomCapacity = await prisma.proSelRoomCapacity.findUniqueOrThrow({
        where: { room: booking.room },
    });

    const emailData = {
        fullName: booking.fullName,
        email: booking.email,
        roomLabel: roomCapacity.label,
        startTime: booking.startTime,
        endTime: booking.endTime,
        eventDate: booking.eventDate,
    };

    try {
        const { subject, html } = candidateConfirmationEmail(emailData);
        await sendMail({ to: booking.email, subject, html });
        await prisma.proSelBooking.update({
            where: { id: booking.id },
            data: { candidateEmailStatus: 'sent' },
        });
    } catch (error) {
        console.error('[prosel] Failed to send candidate confirmation email:', error);
        await prisma.proSelBooking.update({
            where: { id: booking.id },
            data: { candidateEmailStatus: 'failed', candidateEmailAttempts: { increment: 1 } },
        });
    }

    try {
        const { subject, html } = adminBookingNotificationEmail(emailData);
        await sendMail({ to: process.env.PROSEL_ADMIN_EMAIL || 'liaoufba@gmail.com', subject, html });
        await prisma.proSelBooking.update({
            where: { id: booking.id },
            data: { adminEmailStatus: 'sent' },
        });
    } catch (error) {
        console.error('[prosel] Failed to send admin notification email:', error);
        await prisma.proSelBooking.update({
            where: { id: booking.id },
            data: { adminEmailStatus: 'failed', adminEmailAttempts: { increment: 1 } },
        });
    }
}

async function sendRoomFullNotification(room: ProSelRoom) {
    const roomCapacity = await prisma.proSelRoomCapacity.findUniqueOrThrow({ where: { room } });
    const candidates = await prisma.proSelBooking.findMany({
        where: { room },
        orderBy: { createdAt: 'asc' },
        select: { fullName: true, email: true },
    });

    try {
        const { subject, html } = roomFullNotificationEmail({
            roomLabel: roomCapacity.label,
            startTime: roomCapacity.startTime,
            endTime: roomCapacity.endTime,
            capacity: roomCapacity.capacity,
            eventDate: new Date(PROSEL_EVENT_DATE),
            candidates,
        });
        await sendMail({ to: process.env.PROSEL_ADMIN_EMAIL || 'liaoufba@gmail.com', subject, html });
        await prisma.proSelRoomCapacity.update({
            where: { room },
            data: { fullNotificationStatus: 'sent' },
        });
    } catch (error) {
        console.error('[prosel] Failed to send room-full notification:', error);
        await prisma.proSelRoomCapacity.update({
            where: { room },
            data: { fullNotificationStatus: 'failed', fullNotificationAttempts: { increment: 1 } },
        });
    }
}

export async function resendBookingEmails(bookingId: number) {
    const booking = await prisma.proSelBooking.findUniqueOrThrow({ where: { id: bookingId } });
    await sendBookingEmails(booking);
}

export async function resendRoomFullNotification(room: ProSelRoom) {
    const roomCapacity = await prisma.proSelRoomCapacity.findUniqueOrThrow({ where: { room } });
    if (!roomCapacity.fullNotifiedAt) {
        throw new InvalidRoomError();
    }
    await sendRoomFullNotification(room);
}

export async function listBookings() {
    return prisma.proSelBooking.findMany({ orderBy: { createdAt: 'desc' } });
}
