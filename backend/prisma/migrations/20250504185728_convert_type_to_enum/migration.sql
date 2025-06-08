/*
  Warnings:

  - Changed the type of `type` on the `Contribution` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ContributionType" AS ENUM ('PRESENCIAL', 'REMOTO', 'DOACAO', 'SUPORTE_TECNICO', 'OUTRO');

-- 
-- Remove os dados existentes
DELETE FROM "Contribution";

-- Altera o tipo da coluna
ALTER TABLE "Contribution"
DROP COLUMN "type",
ADD COLUMN "type" "ContributionType" NOT NULL;
