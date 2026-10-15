-- CreateEnum
CREATE TYPE "ProSelRoom" AS ENUM ('SALA_1', 'SALA_2');

-- CreateEnum
CREATE TYPE "EmailDeliveryStatus" AS ENUM ('pending', 'sent', 'failed');

-- CreateTable
CREATE TABLE "ProSelRoomCapacity" (
    "room" "ProSelRoom" NOT NULL,
    "label" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "bookedCount" INTEGER NOT NULL DEFAULT 0,
    "fullNotifiedAt" TIMESTAMP(3),
    "fullNotificationStatus" "EmailDeliveryStatus" NOT NULL DEFAULT 'pending',
    "fullNotificationAttempts" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProSelRoomCapacity_pkey" PRIMARY KEY ("room")
);

-- CreateTable
CREATE TABLE "ProSelBooking" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "room" "ProSelRoom" NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "candidateEmailStatus" "EmailDeliveryStatus" NOT NULL DEFAULT 'pending',
    "candidateEmailAttempts" INTEGER NOT NULL DEFAULT 0,
    "adminEmailStatus" "EmailDeliveryStatus" NOT NULL DEFAULT 'pending',
    "adminEmailAttempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProSelBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProSelBooking_email_key" ON "ProSelBooking"("email");

-- AddForeignKey
ALTER TABLE "ProSelBooking" ADD CONSTRAINT "ProSelBooking_room_fkey" FOREIGN KEY ("room") REFERENCES "ProSelRoomCapacity"("room") ON DELETE RESTRICT ON UPDATE CASCADE;
