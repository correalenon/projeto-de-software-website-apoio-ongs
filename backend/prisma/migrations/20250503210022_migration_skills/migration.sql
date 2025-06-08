-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "skills" TEXT[],
ALTER COLUMN "description" DROP NOT NULL;
