-- Seed the fixed room/slot configuration for the ProSel in-person dynamic.
-- This is static event configuration (not candidate data), so it is safe
-- to seed via migration. Uses ON CONFLICT so re-running is a no-op.
INSERT INTO "ProSelRoomCapacity" ("room", "label", "startTime", "endTime", "capacity", "updatedAt")
VALUES
    ('SALA_1', 'Sala 1', '08:00', '11:00', 15, CURRENT_TIMESTAMP),
    ('SALA_2', 'Sala 2', '13:00', '16:00', 25, CURRENT_TIMESTAMP)
ON CONFLICT ("room") DO NOTHING;
