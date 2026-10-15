-- Set the final room labels and capacities for the ProSel in-person dynamic
-- (Sala 1 - MANHA - 15 vagas / Sala 2 - TARDE - 25 vagas), overriding the
-- earlier seed/test values.
UPDATE "ProSelRoomCapacity" SET "label" = 'Sala 1 - MANHÃ', "capacity" = 15 WHERE "room" = 'SALA_1';
UPDATE "ProSelRoomCapacity" SET "label" = 'Sala 2 - TARDE', "capacity" = 25 WHERE "room" = 'SALA_2';
