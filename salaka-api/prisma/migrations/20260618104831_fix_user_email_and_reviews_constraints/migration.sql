/*
  Warnings:

  - You are about to drop the column `buttonLink` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `createedById` on the `ClientReview` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `createedById` on the `OverallReview` table. All the data in the column will be lost.
  - You are about to drop the column `isLimitedStock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `ShippingDetails` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,productId]` on the table `Reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdById` to the `ClientReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `OverallReview` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PAYMENT_PROVIDER" AS ENUM ('CashOnDelivery', 'Khalti', 'Esewa');

-- DropForeignKey
ALTER TABLE "Banner" DROP CONSTRAINT "Banner_productId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_userId_fkey";

-- DropForeignKey
ALTER TABLE "ClientReview" DROP CONSTRAINT "ClientReview_createedById_fkey";

-- DropForeignKey
ALTER TABLE "HeroBanner" DROP CONSTRAINT "HeroBanner_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "OverallReview" DROP CONSTRAINT "OverallReview_createedById_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_addedBy_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ShippingDetails" DROP CONSTRAINT "ShippingDetails_userId_fkey";

-- DropIndex
DROP INDEX "Order_orderStatus_paymentStatus_idx";

-- DropIndex
DROP INDEX "Order_paymentMethod_idx";

-- DropIndex
DROP INDEX "Order_paymentStatus_idx";

-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "buttonLink",
ALTER COLUMN "slug" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ClientReview" DROP COLUMN "createedById",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentMethod",
DROP COLUMN "paymentStatus",
ADD COLUMN     "deliveryCharge" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "paymentDeadline" TIMESTAMP(3),
ADD COLUMN     "paymentProvider" "PAYMENT_PROVIDER" NOT NULL DEFAULT 'CashOnDelivery';

-- AlterTable
ALTER TABLE "OverallReview" DROP COLUMN "createedById",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isLimitedStock";

-- DropTable
DROP TABLE "ShippingDetails";

-- CreateTable
CREATE TABLE "shipping_details" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" "PAYMENT_PROVIDER" NOT NULL,
    "transactionId" TEXT,
    "pidx" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PAYMENT_STATUS" NOT NULL DEFAULT 'Pending',
    "rawResponse" JSONB,
    "webhookVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shipping_details_userId_key" ON "shipping_details"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_pidx_key" ON "Payment"("pidx");

-- CreateIndex
CREATE INDEX "Order_paymentProvider_idx" ON "Order"("paymentProvider");

-- CreateIndex
CREATE INDEX "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_userId_productId_key" ON "Reviews"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientReview" ADD CONSTRAINT "ClientReview_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OverallReview" ADD CONSTRAINT "OverallReview_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_details" ADD CONSTRAINT "shipping_details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroBanner" ADD CONSTRAINT "HeroBanner_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
