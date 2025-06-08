-- AlterTable
ALTER TABLE "Activities" ADD COLUMN     "ongId" INTEGER;

-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "ongId" INTEGER;

-- AlterTable
ALTER TABLE "Likes" ADD COLUMN     "ongId" INTEGER;

-- AlterTable
ALTER TABLE "Ongs" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ONG';

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "Ongs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "Ongs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activities" ADD CONSTRAINT "Activities_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "Ongs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
