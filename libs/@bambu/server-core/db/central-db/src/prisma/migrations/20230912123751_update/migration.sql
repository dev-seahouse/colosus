/*
  Warnings:

  - You are about to drop the column `questionnaire_groupings` on the `questionnaire_groupings` table. All the data in the column will be lost.
  - Added the required column `grouping_weight` to the `questionnaire_groupings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "questionnaire_groupings" DROP COLUMN "questionnaire_groupings",
ADD COLUMN     "grouping_weight" DECIMAL(10,8) NOT NULL;
