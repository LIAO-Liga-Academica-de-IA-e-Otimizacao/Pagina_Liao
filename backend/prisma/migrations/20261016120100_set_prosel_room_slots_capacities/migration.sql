-- Set the final morning/afternoon room slots and capacities for the ProSel
-- in-person dynamic:
--   Sala 1 (manhã) - 09h-10h - 8 vagas
--   Sala 2 (manhã) - 10h-11h - 8 vagas
--   Sala 3 (tarde) - 13h-14h - 12 vagas
--   Sala 4 (tarde) - 14h-15h - 13 vagas
UPDATE "ProSelRoomCapacity" SET "label" = 'Sala 1 - Manhã', "startTime" = '09:00', "endTime" = '10:00', "capacity" = 8 WHERE "room" = 'SALA_1';
UPDATE "ProSelRoomCapacity" SET "label" = 'Sala 2 - Manhã', "startTime" = '10:00', "endTime" = '11:00', "capacity" = 8 WHERE "room" = 'SALA_2';

INSERT INTO "ProSelRoomCapacity" ("room", "label", "startTime", "endTime", "capacity", "updatedAt")
VALUES
    ('SALA_3', 'Sala 3 - Tarde', '13:00', '14:00', 12, CURRENT_TIMESTAMP),
    ('SALA_4', 'Sala 4 - Tarde', '14:00', '15:00', 13, CURRENT_TIMESTAMP)
ON CONFLICT ("room") DO UPDATE SET
    "label" = EXCLUDED."label",
    "startTime" = EXCLUDED."startTime",
    "endTime" = EXCLUDED."endTime",
    "capacity" = EXCLUDED."capacity";
