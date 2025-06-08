/*
  Warnings:

  - You are about to drop the column `projectId` on the `Images` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Tags` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Images" DROP CONSTRAINT "Images_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Tags" DROP CONSTRAINT "Tags_projectId_fkey";

-- AlterTable
ALTER TABLE "Images" DROP COLUMN "projectId";

-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "complementImages" TEXT[],
ADD COLUMN     "projectImage" TEXT;

-- AlterTable
ALTER TABLE "Tags" DROP COLUMN "projectId";
