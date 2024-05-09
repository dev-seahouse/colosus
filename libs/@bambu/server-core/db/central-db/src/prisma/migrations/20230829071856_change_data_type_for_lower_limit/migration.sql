/*
  Warnings:

  - You are about to alter the column `lower_limit` on the `risk_profiles` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,8)`.

*/
-- AlterTable
ALTER TABLE "risk_profiles" ALTER COLUMN "lower_limit" SET DATA TYPE DECIMAL(10,8);
