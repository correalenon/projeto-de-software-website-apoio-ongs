/*
  Warnings:

  - A unique constraint covering the columns `[emailONG]` on the table `Ongs` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Ongs" ALTER COLUMN "area" DROP NOT NULL,
ALTER COLUMN "cep" DROP NOT NULL,
ALTER COLUMN "goals" DROP NOT NULL,
ALTER COLUMN "street" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ongs_emailONG_key" ON "Ongs"("emailONG");
