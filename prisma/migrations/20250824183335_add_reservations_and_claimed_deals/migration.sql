-- CreateEnum
CREATE TYPE "public"."ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."ClaimStatus" AS ENUM ('CLAIMED', 'REDEEMED', 'EXPIRED');

-- CreateTable
CREATE TABLE "public"."Reservation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "partySize" INTEGER NOT NULL,
    "specialRequests" TEXT,
    "status" "public"."ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "phoneNumber" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ClaimedDeal" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "offerId" INTEGER NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redeemedAt" TIMESTAMP(3),
    "status" "public"."ClaimStatus" NOT NULL DEFAULT 'CLAIMED',
    "redemptionCode" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "ClaimedDeal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reservation_userId_idx" ON "public"."Reservation"("userId");

-- CreateIndex
CREATE INDEX "Reservation_restaurantId_idx" ON "public"."Reservation"("restaurantId");

-- CreateIndex
CREATE INDEX "Reservation_date_idx" ON "public"."Reservation"("date");

-- CreateIndex
CREATE INDEX "Reservation_status_idx" ON "public"."Reservation"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ClaimedDeal_redemptionCode_key" ON "public"."ClaimedDeal"("redemptionCode");

-- CreateIndex
CREATE INDEX "ClaimedDeal_userId_idx" ON "public"."ClaimedDeal"("userId");

-- CreateIndex
CREATE INDEX "ClaimedDeal_offerId_idx" ON "public"."ClaimedDeal"("offerId");

-- CreateIndex
CREATE INDEX "ClaimedDeal_redemptionCode_idx" ON "public"."ClaimedDeal"("redemptionCode");

-- CreateIndex
CREATE INDEX "ClaimedDeal_status_idx" ON "public"."ClaimedDeal"("status");

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "public"."Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClaimedDeal" ADD CONSTRAINT "ClaimedDeal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClaimedDeal" ADD CONSTRAINT "ClaimedDeal_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "public"."Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
