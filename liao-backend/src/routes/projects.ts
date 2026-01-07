import { Router } from 'express';
import { createProject, getProjects, updateProject, deleteProject } from '../controllers/ProjectController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getProjects);

// Protected routes (Admin only)
router.post('/', authenticate, requireAdmin, createProject);
router.put('/:id', authenticate, requireAdmin, updateProject);
router.delete('/:id', authenticate, requireAdmin, deleteProject);

export default router;
