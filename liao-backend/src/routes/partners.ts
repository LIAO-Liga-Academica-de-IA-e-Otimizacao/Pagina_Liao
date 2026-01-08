import { Router } from 'express';
import { getAllPartners, createPartner, deletePartner, updatePartner } from '../controllers/PartnerController';
import { authenticate } from '../middleware/auth';

const router = Router();

console.log('[DEBUG] Loading partners routes module');

router.get('/', (req, res, next) => {
    console.log('[DEBUG] Hit /api/partners GET');
    next();
}, getAllPartners);
router.post('/', authenticate, createPartner);
router.put('/:id', authenticate, updatePartner);
router.delete('/:id', authenticate, deletePartner);

export default router;
