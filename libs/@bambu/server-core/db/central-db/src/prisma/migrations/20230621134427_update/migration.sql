/*
  Warnings:

  - Added the required column `updated_at` to the `connect_advisor_preferences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "connect_advisor_preferences" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown';
