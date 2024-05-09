/*
  Warnings:

  - A unique constraint covering the columns `[brokerage,partner_account_id]` on the table `investor_platform_user_accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "investor_platform_user_accounts_brokerage_partner_account_i_key" ON "investor_platform_user_accounts"("brokerage", "partner_account_id");
