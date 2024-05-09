/*
  Warnings:

  - Made the column `recommended_monthly_contribution` on table `goals` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "goals" ALTER COLUMN "recommended_monthly_contribution" SET NOT NULL;
