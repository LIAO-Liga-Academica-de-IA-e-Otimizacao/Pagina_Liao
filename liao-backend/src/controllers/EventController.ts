import { Request, Response } from 'express';
import prisma from '../config/database';

export const createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, slug, description, coverImage, date, location, speakers, gallery, highlights } = req.body;

        const event = await prisma.event.create({
            data: {
                title,
                slug,
                description,
                coverImage,
                date: new Date(date),
                location,
                speakers: speakers || [],
                gallery: gallery || [],
                highlights: highlights || [],
            },
        });

        res.status(201).json({ success: true, data: event });
    } catch (error: any) {
        console.error('Error creating event:', error);
        if (error.code === 'P2002') {
             res.status(400).json({ success: false, error: 'Event with this slug already exists.' });
             return;
        }
        res.status(500).json({ success: false, error: 'Failed to create event' });
    }
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: 'desc' },
        });

        res.json({ success: true, data: events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch events' });
    }
};

export const getEventBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const event = await prisma.event.findUnique({
            where: { slug },
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

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, slug, description, coverImage, date, location, speakers, gallery, highlights } = req.body;

        const event = await prisma.event.update({
            where: { id: Number(id) },
            data: {
                title,
                slug,
                description,
                coverImage,
                date: date ? new Date(date) : undefined,
                location,
                speakers,
                gallery,
                highlights,
            },
        });

        res.json({ success: true, data: event });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ success: false, error: 'Failed to update event' });
    }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.event.delete({
            where: { id: Number(id) },
        });
        res.json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ success: false, error: 'Failed to delete event' });
    }
};
