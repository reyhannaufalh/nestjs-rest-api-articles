/*
  Warnings:

  - You are about to drop the `_PostToPostCategories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PostToPostCategories" DROP CONSTRAINT "_PostToPostCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostToPostCategories" DROP CONSTRAINT "_PostToPostCategories_B_fkey";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_PostToPostCategories";

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "post_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
