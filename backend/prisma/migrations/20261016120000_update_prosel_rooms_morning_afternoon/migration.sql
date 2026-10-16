-- Expand the ProSel in-person dynamic from 2 rooms to 4 rooms, split into a
-- morning session (Sala 1 e Sala 2) and an afternoon session (Sala 3 e Sala 4),
-- each with its own 1-hour slot and capacity.
-- AlterEnum
ALTER TYPE "ProSelRoom" ADD VALUE IF NOT EXISTS 'SALA_3';
ALTER TYPE "ProSelRoom" ADD VALUE IF NOT EXISTS 'SALA_4';
