import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { AuthRequest, JWTPayload } from '../types';

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                error: 'Email and password are required',
            });
            return;
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
            return;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
            return;
        }

        // Generate JWT token
        const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
        const payload: JWTPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: `Login failed: ${(error as any).message}`,
        });
    }
};

// Register (admin only)
const MASTER_ADMIN_EMAILS = ['liaoufba@gmail.com', 'bispodeivisnan@gmail.com'];

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        // Enforce Master Admin permission
        const actingUser = (req as any).user;
        const requesterId = actingUser?.id;

        if (requesterId) {
            const requester = await prisma.user.findUnique({ where: { id: requesterId } });
            if (!requester || !MASTER_ADMIN_EMAILS.includes(requester.email)) {
                res.status(403).json({
                    success: false,
                    error: 'Somente Administradores Master podem adicionar novos administradores.',
                });
                return;
            }
        }

        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            res.status(400).json({
                success: false,
                error: 'Email, password, and name are required',
            });
            return;
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            res.status(400).json({
                success: false,
                error: 'User with this email already exists',
            });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            },
            message: 'Admin user created successfully',
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            error: 'Registration failed',
        });
    }
};

// Get current user
export const getCurrentUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const authReq = req as AuthRequest;

        if (!authReq.user) {
            res.status(401).json({
                success: false,
                error: 'Not authenticated',
            });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: authReq.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found',
            });
            return;
        }

        res.json({
            success: true,
            data: { user },
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get user information',
        });
    }
};


// Get all admins
export const getAdmins = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch admins',
        });
    }
};



// Delete admin
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const actingUser = (req as any).user;
        const actingUserId = actingUser.id;
        const targetUserId = parseInt(req.params.id);

        if (!actingUser) {
            res.status(403).json({ success: false, error: 'Unauthorized' });
            return;
        }

        // Fetch full acting user to check email
        const fullActingUser = await prisma.user.findUnique({ where: { id: actingUserId } });
        if (!fullActingUser) {
            res.status(403).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const isActingMaster = MASTER_ADMIN_EMAILS.includes(fullActingUser.email);

        const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
        if (!targetUser) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }
        const isTargetMaster = MASTER_ADMIN_EMAILS.includes(targetUser.email);

        // SELF DELETION
        if (actingUserId === targetUserId) {
            if (isActingMaster) {
                // Check remaining masters
                const allUsers = await prisma.user.findMany();
                const masterCount = allUsers.filter((u: any) => MASTER_ADMIN_EMAILS.includes(u.email)).length;

                if (masterCount <= 2) {
                    res.status(403).json({
                        success: false,
                        error: 'Não é possível excluir. O sistema deve manter no mínimo 2 Administradores Master.'
                    });
                    return;
                }
            }
            // Allow deletion
        }
        // MASTER DELETING OTHERS
        else {
            if (!isActingMaster) {
                res.status(403).json({ success: false, error: 'Apenas Administradores Master podem excluir outros usuários.' });
                return;
            }

            if (isTargetMaster) {
                res.status(403).json({ success: false, error: 'Administradores Master não podem excluir uns aos outros.' });
                return;
            }
        }

        await prisma.user.delete({ where: { id: targetUserId } });

        res.json({ success: true, message: 'Administrador excluído com sucesso.' });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, error: 'Failed to delete user' });
    }
};
