/*
  Warnings:

  - The `tag` column on the `Banner` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[slug]` on the table `Banner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "BANNER_TAG" AS ENUM ('BlackFriday', 'BestSelling', 'LimitedStock', 'NewArrival');

-- AlterTable
ALTER TABLE "Banner" ADD COLUMN     "slug" TEXT NOT NULL DEFAULT '',
DROP COLUMN "tag",
ADD COLUMN     "tag" "BANNER_TAG";

-- CreateIndex
CREATE UNIQUE INDEX "Banner_slug_key" ON "Banner"("slug");
