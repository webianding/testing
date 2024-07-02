/*
  Warnings:

  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rut]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `first_name`,
    DROP COLUMN `last_name`,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `age` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `commune` VARCHAR(191) NULL,
    ADD COLUMN `dateOfBirth` DATETIME(3) NULL,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `rut` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Doctor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `rut` VARCHAR(191) NOT NULL,
    `medicalRegistryNumber` VARCHAR(191) NOT NULL,
    `specialty` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `commune` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Doctor_rut_key`(`rut`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prescription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `diagnosis` VARCHAR(191) NOT NULL,
    `medicationName` VARCHAR(191) NOT NULL,
    `dailyQuantity` VARCHAR(191) NOT NULL,
    `numberOfDailyDoses` VARCHAR(191) NOT NULL,
    `consumptionSchedule` VARCHAR(191) NOT NULL,
    `administrationMethod` VARCHAR(191) NOT NULL,
    `treatmentGoal` VARCHAR(191) NOT NULL,
    `issueDate` DATETIME(3) NOT NULL,
    `expiryDate` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `doctorId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_rut_key` ON `User`(`rut`);

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
