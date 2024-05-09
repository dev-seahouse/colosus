/*
  Warnings:

  - Added the required column `contact_me_reasons` to the `connect_advisor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_bio` to the `connect_advisor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "connect_advisor"
  ADD COLUMN "contact_me_reasons" TEXT NOT NULL,
  ADD COLUMN "profile_bio"        TEXT NOT NULL;
