/*
  Warnings:

  - Added the required column `full_profile_link` to the `connect_advisor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "connect_advisor" ADD COLUMN     "advisor_profile_picture_url" VARCHAR(255),
ADD COLUMN     "full_profile_link" VARCHAR(255);
