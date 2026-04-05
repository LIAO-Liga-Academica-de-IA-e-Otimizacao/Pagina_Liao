import { Request, Response } from 'express';
import prisma from '../config/database';
import { logAudit } from '../middleware/auditLogger';

/**
 * @openapi
 * /api/events:
 *   post:
 *     summary: createEvent operation
 *     tags: [Events]
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 */
export const createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, slug, description, coverImage, date, location, speakers, agenda, partners, gallery, highlights, palette, fontClass, borderRadius, subscribe } = req.body;

        const event = await prisma.event.create({
            data: {
                title,
                slug,
                description,
                coverImage,
                date: new Date(date),
                location,
                gallery: gallery || [],
                highlights: highlights || [],
                palette: palette || [],
                fontClass,
                borderRadius,
                subscribe,
                speakers: {
                    create: speakers?.map((s: any) => ({
                        memberId: s.memberId || null,
                        name: s.name,
                        role: s.role,
                        photo: s.photo,
                        company: s.company,
                        link: s.link
                    })) || []
                },
                agenda: {
                    create: agenda?.map((a: any) => ({
                        time: a.time,
                        title: a.title,
                        description: a.description,
                        speakerName: a.speakerName
                    })) || []
                },
                partners: partners ? {
                    connect: partners.map((id: number) => ({ id }))
                } : undefined
            },
            include: {
                speakers: { include: { member: true } },
                agenda: true,
                partners: true
            }
        });

        res.status(201).json({ success: true, data: event });
        logAudit(req, { action: 'CREATE', resource: 'events', resourceId: event.id, details: { title: event.title, slug: event.slug } });

    } catch (error: any) {
        console.error('Error creating event:', error);
        if (error.code === 'P2002') {
             res.status(400).json({ success: false, error: 'Event with this slug already exists.' });
             return;
        }
        res.status(500).json({ success: false, error: 'Failed to create event' });
    }
};

/**
 * @openapi
 * /api/events:
 *   get:
 *     summary: getEvents operation
 *     tags: [Events]
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 */
export const getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: 'desc' },
            include: {
                speakers: { include: { member: true } },
                agenda: true,
                partners: true
            }
        });

        res.json({ success: true, data: events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch events' });
    }
};

/**
 * @openapi
 * /api/events/{slug}:
 *   get:
 *     summary: getEventBySlug operation
 *     tags: [Events]
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 */
export const getEventBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const event = await prisma.event.findUnique({
            where: { slug },
            include: {
                speakers: { include: { member: true } },
                agenda: true,
                partners: true
            }
        });

        if (!event) {
            res.status(404).json({ success: false, error: 'Event not found' });
            return;
        }

        res.json({ success: true, data: event });
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch event details' });
    }
};

/**
 * @openapi
 * /api/events/{id}:
 *   put:
 *     summary: updateEvent operation
 *     tags: [Events]
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 */
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, slug, description, coverImage, date, location, speakers, agenda, partners, gallery, highlights, palette, fontClass, borderRadius, subscribe } = req.body;

        const event = await prisma.event.update({
            where: { id: Number(id) },
            data: {
                title,
                slug,
                description,
                coverImage,
                date: date ? new Date(date) : undefined,
                location,
                gallery,
                highlights,
                palette,
                fontClass,
                borderRadius,
                subscribe,
                speakers: speakers ? {
                    deleteMany: {}, // Clear old speakers and re-insert
                    create: speakers.map((s: any) => ({
                        memberId: s.memberId || null,
                        name: s.name,
                        role: s.role,
                        photo: s.photo,
                        company: s.company,
                        link: s.link
                    }))
                } : undefined,
                agenda: agenda ? {
                    deleteMany: {}, // Clear old agenda and re-insert
                    create: agenda.map((a: any) => ({
                        time: a.time,
                        title: a.title,
                        description: a.description,
                        speakerName: a.speakerName
                    }))
                } : undefined,
                partners: partners ? {
                    set: partners.map((id: number) => ({ id }))
                } : undefined
            },
            include: {
                speakers: { include: { member: true } },
                agenda: true,
                partners: true
            }
        });

        res.json({ success: true, data: event });
        logAudit(req, { action: 'UPDATE', resource: 'events', resourceId: event.id, details: { title: event.title } });

    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ success: false, error: 'Failed to update event' });
    }
};

/**
 * @openapi
 * /api/events/{id}:
 *   delete:
 *     summary: deleteEvent operation
 *     tags: [Events]
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 */
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.event.delete({
            where: { id: Number(id) },
        });
        res.json({ success: true, message: 'Event deleted successfully' });
        logAudit(req, { action: 'DELETE', resource: 'events', resourceId: Number(id) });

    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ success: false, error: 'Failed to delete event' });
    }
};