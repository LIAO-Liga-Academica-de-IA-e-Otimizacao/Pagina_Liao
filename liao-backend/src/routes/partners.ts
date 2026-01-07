import { Router } from 'express';
import * as PartnerController from '../controllers/PartnerController';
import { authenticate } from '../middleware/auth';

const router = Router();

console.log('[DEBUG] Loading partners routes module');

router.get('/', (req, res, next) => {
    console.log('[DEBUG] Hit /api/partners GET');
    next();
}, PartnerController.getAllPartners);
router.post('/', authenticate, PartnerController.createPartner);
router.delete('/:id', authenticate, PartnerController.deletePartner);

export default router;
