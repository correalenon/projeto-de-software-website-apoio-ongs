/*
  Warnings:

  - The values [ADVERTISER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `ongId` on the `Images` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `Ongs` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Ongs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Ongs` table. All the data in the column will be lost.
  - Added the required column `area` to the `Ongs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cep` to the `Ongs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emailONG` to the `Ongs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foundationDate` to the `Ongs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goals` to the `Ongs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameLegalGuardian` to the `Ongs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameONG` to the `Ongs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Ongs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socialName` to the `Ongs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Ongs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'VOLUNTARY', 'COLLABORATOR');
ALTER TABLE "Users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'ADMIN';
COMMIT;

-- DropForeignKey
ALTER TABLE "Images" DROP CONSTRAINT "Images_ongId_fkey";

-- DropForeignKey
ALTER TABLE "Ongs" DROP CONSTRAINT "Ongs_userId_fkey";

-- AlterTable
ALTER TABLE "Images" DROP COLUMN "ongId";

-- AlterTable
ALTER TABLE "Ongs" DROP COLUMN "contact",
DROP COLUMN "name",
DROP COLUMN "userId",
ADD COLUMN     "area" TEXT NOT NULL,
ADD COLUMN     "cellphone" TEXT,
ADD COLUMN     "cellphoneLegalGuardian" TEXT,
ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "cpfLegalGuardian" TEXT,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "emailONG" TEXT NOT NULL,
ADD COLUMN     "foundationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "goals" TEXT NOT NULL,
ADD COLUMN     "nameLegalGuardian" TEXT NOT NULL,
ADD COLUMN     "nameONG" TEXT NOT NULL,
ADD COLUMN     "number" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "rgLegalGuardian" TEXT,
ADD COLUMN     "socialMedia" TEXT,
ADD COLUMN     "socialName" TEXT NOT NULL,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "ongId" INTEGER;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "Ongs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
