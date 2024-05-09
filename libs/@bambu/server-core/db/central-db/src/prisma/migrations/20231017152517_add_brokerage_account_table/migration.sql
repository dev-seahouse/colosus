-- CreateTable
CREATE TABLE "investor_platform_user_accounts" (
    "id" VARCHAR(36) NOT NULL,
    "brokerage" VARCHAR(255) NOT NULL,
    "partner_account_id" VARCHAR(255) NOT NULL,
    "partner_account_number" VARCHAR(255) NOT NULL,
    "partner_account_type" VARCHAR(255) NOT NULL,
    "data" JSONB,
    "investor_platform_user_id" VARCHAR(36) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investor_platform_user_accounts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "investor_platform_user_accounts" ADD CONSTRAINT "investor_platform_user_accounts_investor_platform_user_id_fkey" FOREIGN KEY ("investor_platform_user_id") REFERENCES "investor_platform_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
