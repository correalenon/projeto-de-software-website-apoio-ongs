/*
  Warnings:

  - You are about to drop the column `url` on the `Images` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Likes` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Images" DROP COLUMN "url",
ADD COLUMN     "caption" TEXT,
ADD COLUMN     "content" TEXT;

-- AlterTable
ALTER TABLE "Likes" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "title";
