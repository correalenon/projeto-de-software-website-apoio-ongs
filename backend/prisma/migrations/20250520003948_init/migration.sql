-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "ongId" INTEGER;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "Ongs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
