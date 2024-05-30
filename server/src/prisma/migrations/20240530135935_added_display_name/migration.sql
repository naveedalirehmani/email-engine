/*
  Warnings:

  - The values [FACEBOOK_USER] on the enum `User_userType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `displayName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `displayName` VARCHAR(191) NOT NULL,
    MODIFY `userType` ENUM('LOCAL', 'GOOGLE_USER', 'OUTLOOK_USER') NOT NULL DEFAULT 'LOCAL';
