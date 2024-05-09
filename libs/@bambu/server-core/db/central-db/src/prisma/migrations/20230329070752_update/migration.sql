/*
  Warnings:

  - You are about to drop the column `tennant_id` on the `tenant_api_keys` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tenant_api_keys"
  DROP CONSTRAINT "tenant_api_keys_tennant_id_fkey";

-- AlterTable
ALTER TABLE "tenant_api_keys"
  ADD COLUMN "tenant_id" TEXT;
UPDATE "tenant_api_keys"
  SET tenant_id = tennant_id;
ALTER TABLE "tenant_api_keys"
  DROP COLUMN "tennant_id";

-- CreateTable
CREATE TABLE "tenant_subscriptions"
(
  "id"                                VARCHAR(36)  NOT NULL,
  "tenant_id"                         TEXT,
  "created_by"                        VARCHAR(255) NOT NULL DEFAULT 'unknown',
  "created_at"                        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by"                        VARCHAR(255) NOT NULL DEFAULT 'unknown',
  "updated_at"                        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "subscription_provider_name"        TEXT         NOT NULL,
  "subscription_provider_customer_id" TEXT         NOT NULL,
  "subscription_provider_product_id"  TEXT,
  "subscription_metadata"             JSONB,
  "status"                            TEXT,

  CONSTRAINT "tenant_subscriptions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tenant_subscriptions"
  ADD CONSTRAINT "tenant_subscriptions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_api_keys"
  ADD CONSTRAINT "tenant_api_keys_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
