/*
  Warnings:

  - You are about to drop the column `exp` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "exp";

-- CreateTable
CREATE TABLE "TokenMapper" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exp" TEXT NOT NULL,
    "uid" TEXT NOT NULL,

    CONSTRAINT "TokenMapper_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TokenMapper" ADD CONSTRAINT "TokenMapper_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
