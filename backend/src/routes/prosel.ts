import { Router } from 'express';
import {
    getProSelInfo,
    submitApplication,
    getAllApplications,
    updateApplicationStatus,
} from '../controllers/proselController';
import {
    getProSelAvailability,
    createProSelBooking,
    getProSelBookings,
    resendProSelBookingEmail,
    resendProSelRoomFullNotification,
} from '../controllers/proselBookingController';
import { authenticate, requirePermission } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getProSelInfo);
router.post('/apply', submitApplication);

// Public routes - in-person dynamic room booking
router.get('/availability', getProSelAvailability);
router.post('/bookings', createProSelBooking);

// Protected routes (admin only)
router.get('/applications', authenticate, getAllApplications);
router.put('/applications/:id', authenticate, updateApplicationStatus);

router.get('/bookings', authenticate, requirePermission('prosel'), getProSelBookings);
router.post(
    '/bookings/:id/resend-email',
    authenticate,
    requirePermission('prosel'),
    resendProSelBookingEmail
);
router.post(
    '/room-notifications/:room/resend',
    authenticate,
    requirePermission('prosel'),
    resendProSelRoomFullNotification
);

export default router;
