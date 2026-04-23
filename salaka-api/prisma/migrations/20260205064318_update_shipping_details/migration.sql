/*
  Warnings:

  - You are about to drop the column `city` on the `ShippingDetails` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `ShippingDetails` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `ShippingDetails` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `ShippingDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShippingDetails" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "state",
DROP COLUMN "zipCode";
