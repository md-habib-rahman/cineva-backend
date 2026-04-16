/*
  Warnings:

  - You are about to drop the column `duration` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Content` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Content_slug_key";

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "duration",
DROP COLUMN "slug";
