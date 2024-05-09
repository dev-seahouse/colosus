/*
  Warnings:

  - You are about to alter the column `tenant_id` on the `tenant_api_keys` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `tenant_id` on the `tenant_http_urls` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `tenant_id` on the `tenant_subscriptions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.

*/
-- DropForeignKey
ALTER TABLE "tenant_api_keys" DROP CONSTRAINT "tenant_api_keys_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "tenant_http_urls" DROP CONSTRAINT "tenant_http_urls_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "tenant_subscriptions" DROP CONSTRAINT "tenant_subscriptions_tenant_id_fkey";

-- AlterTable
ALTER TABLE "tenant_api_keys" ALTER COLUMN "tenant_id" SET DATA TYPE VARCHAR(36);

-- AlterTable
ALTER TABLE "tenant_http_urls" ALTER COLUMN "tenant_id" SET DATA TYPE VARCHAR(36);

-- AlterTable
ALTER TABLE "tenant_subscriptions" ALTER COLUMN "tenant_id" SET DATA TYPE VARCHAR(36);

-- AddForeignKey
ALTER TABLE "tenant_subscriptions" ADD CONSTRAINT "tenant_subscriptions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_api_keys" ADD CONSTRAINT "tenant_api_keys_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_http_urls" ADD CONSTRAINT "tenant_http_urls_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
