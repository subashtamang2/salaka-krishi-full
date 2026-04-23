/*
  Warnings:

  - You are about to drop the column `page` on the `Banner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "page";

-- DropEnum
DROP TYPE "BANNER_PAGE";
