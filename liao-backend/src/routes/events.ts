import { Router } from 'express';
import { createEvent, getEvents, getEventBySlug, updateEvent, deleteEvent } from '../controllers/EventController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getEvents);
router.get('/:slug', getEventBySlug);

// Protected routes (Admin only)
router.post('/', authenticate, requireAdmin, createEvent);
router.put('/:id', authenticate, requireAdmin, updateEvent);
router.delete('/:id', authenticate, requireAdmin, deleteEvent);

export default router;
