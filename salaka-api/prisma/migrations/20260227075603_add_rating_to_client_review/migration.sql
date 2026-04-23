-- CreateTable
CREATE TABLE "OverallReview" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "review" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createedById" TEXT NOT NULL,

    CONSTRAINT "OverallReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OverallReview" ADD CONSTRAINT "OverallReview_createedById_fkey" FOREIGN KEY ("createedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
