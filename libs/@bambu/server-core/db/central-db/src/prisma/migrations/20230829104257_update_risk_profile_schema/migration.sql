/*
  Warnings:

  - Added the required column `risk_profile_description` to the `risk_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `risk_profile_name` to the `risk_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upper_limit` to the `risk_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "risk_profiles" ADD COLUMN     "risk_profile_description" VARCHAR(255) NOT NULL,
ADD COLUMN     "risk_profile_name" VARCHAR(36) NOT NULL,
ADD COLUMN     "upper_limit" DECIMAL(10,8) NOT NULL;
