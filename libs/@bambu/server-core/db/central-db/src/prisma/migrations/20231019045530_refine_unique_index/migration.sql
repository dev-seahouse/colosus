/*
  Warnings:

  - A unique constraint covering the columns `[brokerage,partner_account_id,partner_account_number,partner_account_type]` on the table `investor_platform_user_accounts` will be added. If there are existing duplicate values, this will fail.
  - Made the column `partner_account_number` on table `investor_platform_user_accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `partner_account_type` on table `investor_platform_user_accounts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "investor_platform_user_accounts_brokerage_partner_account_i_key";

-- AlterTable
ALTER TABLE "investor_platform_user_accounts" ALTER COLUMN "partner_account_number" SET NOT NULL,
ALTER COLUMN "partner_account_type" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "investor_platform_user_accounts_brokerage_partner_account_i_key" ON "investor_platform_user_accounts"("brokerage", "partner_account_id", "partner_account_number", "partner_account_type");
