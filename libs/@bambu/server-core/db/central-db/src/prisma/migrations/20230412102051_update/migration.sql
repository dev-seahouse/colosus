/*
  Warnings:

  - You are about to drop the column `finra` on the `connect_advisor` table. All the data in the column will be lost.
  - You are about to drop the column `team_size` on the `connect_advisor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "connect_advisor"
  DROP COLUMN "finra",
  DROP COLUMN "team_size",
  ADD COLUMN "region" VARCHAR(255);
