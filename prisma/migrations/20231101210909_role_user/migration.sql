/*
  Warnings:

  - You are about to drop the column `Role` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `Role`,
    ADD COLUMN `role` INTEGER NOT NULL DEFAULT 1;
