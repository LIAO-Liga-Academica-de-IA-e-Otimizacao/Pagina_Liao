import { Request, Response } from 'express';
import prisma from '../config/database';

// Get all partners
export const getAllPartners = async (req: Request, res: Response) => {
    try {
        const partners = await prisma.partner.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({
            success: true,
            data: partners,
        });
    } catch (error) {
        console.error('Error fetching partners:', error);
        res.status(500).json({ error: 'Failed to fetch partners' });
    }
};

// Create a new partner
export const createPartner = async (req: Request, res: Response) => {
    console.log('Creating partner:', req.body);
    try {
        const { name, imageUrl, websiteUrl } = req.body;

        if (!name || !imageUrl) {
            res.status(400).json({ error: 'Name and Image URL are required' });
            return;
        }

        const partner = await prisma.partner.create({
            data: {
                name,
                imageUrl,
                websiteUrl,
            },
        });

        res.status(201).json({
            success: true,
            data: partner,
        });
    } catch (error) {
        console.error('Error creating partner:', error);
        res.status(500).json({ error: 'Failed to create partner' });
    }
};

// Delete a partner
export const deletePartner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.partner.delete({
            where: {
                id: parseInt(id),
            },
        });

        res.json({
            success: true,
            message: 'Partner deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting partner:', error);
        res.status(500).json({ error: 'Failed to delete partner' });
    }
};
