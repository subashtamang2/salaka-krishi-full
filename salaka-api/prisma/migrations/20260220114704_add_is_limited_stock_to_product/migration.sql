/*
  Warnings:

  - You are about to drop the column `isSpecial` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isSpecial",
ADD COLUMN     "isLimitedStock" BOOLEAN DEFAULT false;
