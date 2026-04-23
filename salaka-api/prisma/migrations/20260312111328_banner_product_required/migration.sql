/*
  Warnings:

  - Made the column `productId` on table `Banner` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Banner" ALTER COLUMN "productId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
