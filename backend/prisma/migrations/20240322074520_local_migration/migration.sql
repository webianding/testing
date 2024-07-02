/*
  Warnings:

  - You are about to drop the column `doctorId` on the `prescription` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `prescription` DROP FOREIGN KEY `Prescription_doctorId_fkey`;

-- AlterTable
ALTER TABLE `prescription` DROP COLUMN `doctorId`,
    ADD COLUMN `doctorRut` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_doctorRut_fkey` FOREIGN KEY (`doctorRut`) REFERENCES `Doctor`(`rut`) ON DELETE SET NULL ON UPDATE CASCADE;
