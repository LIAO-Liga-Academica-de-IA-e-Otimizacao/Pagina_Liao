import { Request, Response } from 'express';
import prisma from '../config/database';

export const createProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, images, date } = req.body;

        if (images && images.length > 10) {
            res.status(400).json({ success: false, error: 'Maximum of 10 images allowed per project.' });
            return;
        }

        const project = await prisma.project.create({
            data: {
                title,
                description,
                images: images || [],
                date: date ? new Date(date) : new Date(),
            },
        });

        res.status(201).json({ success: true, data: project });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ success: false, error: 'Failed to create project' });
    }
};

export const getProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sort } = req.query; // 'recent' or 'oldest'

        const projects = await prisma.project.findMany({
            orderBy: {
                date: sort === 'oldest' ? 'asc' : 'desc',
            },
        });

        res.json({ success: true, data: projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch projects' });
    }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.project.delete({
            where: { id: Number(id) },
        });
        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ success: false, error: 'Failed to delete project' });
    }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, images, date } = req.body;

        if (images && images.length > 10) {
            res.status(400).json({ success: false, error: 'Maximum of 10 images allowed per project.' });
            return;
        }

        const project = await prisma.project.update({
            where: { id: Number(id) },
            data: {
                title,
                description,
                images: images || [],
                date: date ? new Date(date) : undefined,
            },
        });

        res.json({ success: true, data: project });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ success: false, error: 'Failed to update project' });
    }
};
