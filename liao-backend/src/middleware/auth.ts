import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JWTPayload } from '../types';

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: 'No token provided. Authentication required.',
            });
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';

        const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

        // Attach user info to request
        (req as AuthRequest).user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid or expired token.',
        });
    }
};

// Optional: Admin-only middleware
export const requireAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authReq = req as AuthRequest;

    if (!authReq.user || authReq.user.role !== 'admin') {
        res.status(403).json({
            success: false,
            error: 'Admin access required.',
        });
        return;
    }

    next();
};
