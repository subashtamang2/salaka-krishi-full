/*
  Warnings:

  - You are about to drop the column `shopId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `shopId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Shop` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_shopId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_shopId_fkey";

-- DropForeignKey
ALTER TABLE "Shop" DROP CONSTRAINT "Shop_createdBy_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "shopId";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "shopId";

-- DropTable
DROP TABLE "Shop";

-- DropEnum
DROP TYPE "SHOP_STATUS";
