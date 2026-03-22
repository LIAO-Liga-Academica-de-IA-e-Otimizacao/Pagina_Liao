import { Request, Response } from 'express';
import prisma from '../config/database';

// Get all partners
/**
 * @openapi
 * /api/partners:
 *   get:
 *     summary: getAllPartners operation
 *     tags: [Partners]
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
                    $ref: '#/components/schemas/Partner'
 */
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
/**
 * @openapi
 * /api/partners:
 *   post:
 *     summary: createPartner operation
 *     tags: [Partners]
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
                    $ref: '#/components/schemas/Partner'
 */
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

// Update a partner
/**
 * @openapi
 * /api/partners:
 *   put:
 *     summary: updatePartner operation
 *     tags: [Partners]
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
                    $ref: '#/components/schemas/Partner'
 */
export const updatePartner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, imageUrl, websiteUrl } = req.body;

        if (!name || !imageUrl) {
            res.status(400).json({ error: 'Name and Image URL are required' });
            return;
        }

        const partner = await prisma.partner.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name,
                imageUrl,
                websiteUrl,
            },
        });

        res.json({
            success: true,
            data: partner,
        });
    } catch (error) {
        console.error('Error updating partner:', error);
        res.status(500).json({ error: 'Failed to update partner' });
    }
};

// Delete a partner
/**
 * @openapi
 * /api/partners:
 *   delete:
 *     summary: deletePartner operation
 *     tags: [Partners]
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
                    $ref: '#/components/schemas/Partner'
 */
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
