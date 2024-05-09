/*
  Warnings:

  - You are about to drop the `transact_advisor_bank_account` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "transact_advisor_bank_account" DROP CONSTRAINT "transact_advisor_bank_account_tenant_id_fkey";

-- DropTable
DROP TABLE "transact_advisor_bank_account";

-- CreateTable
CREATE TABLE "transact_advisor_bank_accounts" (
    "id" VARCHAR(36) NOT NULL,
    "tenant_id" VARCHAR(36) NOT NULL,
    "account_number" TEXT NOT NULL,
    "sort_code" TEXT NOT NULL,
    "account_name" TEXT NOT NULL,
    "annual_management_fee" TEXT NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transact_advisor_bank_accounts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transact_advisor_bank_accounts" ADD CONSTRAINT "transact_advisor_bank_accounts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
