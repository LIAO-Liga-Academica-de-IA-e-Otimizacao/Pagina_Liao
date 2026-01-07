import { Router } from 'express';
import {
    getMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember,
} from '../controllers/memberController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getMembers);
router.get('/:id', getMemberById);

// Protected routes (Admin only)
router.post('/', authenticate, createMember);
router.put('/:id', authenticate, updateMember);
router.delete('/:id', authenticate, deleteMember);

export default router;
