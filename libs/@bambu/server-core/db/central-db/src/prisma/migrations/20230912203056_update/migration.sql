/*
  Warnings:

  - You are about to alter the column `version_number` on the `questionnaire_versions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `active_version` on the `questionnaires` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "questionnaire_versions" ALTER COLUMN "version_number" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "questionnaires" ALTER COLUMN "active_version" SET DATA TYPE INTEGER;
