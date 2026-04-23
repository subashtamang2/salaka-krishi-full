-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "estimatedDeliveryMaxDays" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "estimatedDeliveryMinDays" INTEGER NOT NULL DEFAULT 2;
