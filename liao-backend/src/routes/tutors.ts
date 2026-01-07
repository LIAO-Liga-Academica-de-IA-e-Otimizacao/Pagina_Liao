import { Router } from 'express';
import {
    getAllTutors,
    getTutorById,
    createTutor,
    updateTutor,
    deleteTutor,
} from '../controllers/tutorController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllTutors);
router.get('/:id', getTutorById);

// Protected routes (admin only)
router.post('/', authenticate, createTutor);
router.put('/:id', authenticate, updateTutor);
router.delete('/:id', authenticate, deleteTutor);

export default router;
