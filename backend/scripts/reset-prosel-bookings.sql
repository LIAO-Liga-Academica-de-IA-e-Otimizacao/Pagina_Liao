-- Reset ProSel in-person scheduling: remove all candidate bookings and
-- zero out the booked count / "room full" notification state for all rooms.
-- Capacities themselves are left untouched
-- (Sala 1 = 8, Sala 2 = 8, Sala 3 = 12, Sala 4 = 13).
BEGIN;

DELETE FROM "ProSelBooking";

UPDATE "ProSelRoomCapacity"
SET "bookedCount" = 0,
    "fullNotifiedAt" = NULL,
    "fullNotificationStatus" = 'pending',
    "fullNotificationAttempts" = 0;

COMMIT;
