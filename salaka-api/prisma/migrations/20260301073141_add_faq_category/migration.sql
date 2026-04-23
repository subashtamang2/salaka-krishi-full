/*
  Warnings:

  - The values [General,Payments] on the enum `FAQ_CATEGORY` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FAQ_CATEGORY_new" AS ENUM ('Shipping', 'Order', 'Returns', 'Products');
ALTER TABLE "public"."FAQ" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "FAQ" ALTER COLUMN "category" TYPE "FAQ_CATEGORY_new" USING ("category"::text::"FAQ_CATEGORY_new");
ALTER TYPE "FAQ_CATEGORY" RENAME TO "FAQ_CATEGORY_old";
ALTER TYPE "FAQ_CATEGORY_new" RENAME TO "FAQ_CATEGORY";
DROP TYPE "public"."FAQ_CATEGORY_old";
ALTER TABLE "FAQ" ALTER COLUMN "category" SET DEFAULT 'Shipping';
COMMIT;

-- AlterTable
ALTER TABLE "FAQ" ALTER COLUMN "category" SET DEFAULT 'Shipping';
