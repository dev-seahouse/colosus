/*
  Warnings:

  - A unique constraint covering the columns `[tenant_id]` on the table `transact_advisor_bank_accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "transact_advisor_bank_accounts_tenant_id_key" ON "transact_advisor_bank_accounts"("tenant_id");
