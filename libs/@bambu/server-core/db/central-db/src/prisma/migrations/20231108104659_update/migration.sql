-- CreateTable
CREATE TABLE "transact_advisor_bank_account" (
    "id" VARCHAR(36) NOT NULL,
    "tenant_id" VARCHAR(36) NOT NULL,
    "account_number" BIGINT NOT NULL,
    "sort_code" INTEGER NOT NULL,
    "account_name" VARCHAR(256) NOT NULL,
    "annual_management_fee" INTEGER NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transact_advisor_bank_account_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transact_advisor_bank_account" ADD CONSTRAINT "transact_advisor_bank_account_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
