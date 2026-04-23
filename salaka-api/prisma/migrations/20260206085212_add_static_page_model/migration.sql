-- CreateEnum
CREATE TYPE "STATIC_PAGE_KEY" AS ENUM ('TermsAndConditions', 'PrivacyPolicy');

-- CreateTable
CREATE TABLE "StaticPage" (
    "id" TEXT NOT NULL,
    "key" "STATIC_PAGE_KEY" NOT NULL DEFAULT 'TermsAndConditions',
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedById" TEXT,

    CONSTRAINT "StaticPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaticPage_key_key" ON "StaticPage"("key");

-- AddForeignKey
ALTER TABLE "StaticPage" ADD CONSTRAINT "StaticPage_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaticPage" ADD CONSTRAINT "StaticPage_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
