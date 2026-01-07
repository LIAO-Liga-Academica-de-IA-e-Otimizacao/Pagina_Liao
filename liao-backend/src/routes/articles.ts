import { Router } from 'express';
import { createArticle, getArticles, updateArticle, deleteArticle } from '../controllers/ArticleController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getArticles);

// Protected routes (Admin only)
router.post('/', authenticate, requireAdmin, createArticle);
router.put('/:id', authenticate, requireAdmin, updateArticle);
router.delete('/:id', authenticate, requireAdmin, deleteArticle);

export default router;
