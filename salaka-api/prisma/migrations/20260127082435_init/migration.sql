-- CreateEnum
CREATE TYPE "USER_STATUS" AS ENUM ('Active', 'Inactive', 'Suspended', 'Revoke');

-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('User', 'Admin', 'SuperAdmin');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "password" TEXT,
    "profileUrl" TEXT,
    "isGoogleLogin" BOOLEAN NOT NULL DEFAULT false,
    "isFacebookLogin" BOOLEAN NOT NULL DEFAULT false,
    "role" "ROLE" NOT NULL DEFAULT 'User',
    "status" "USER_STATUS" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
