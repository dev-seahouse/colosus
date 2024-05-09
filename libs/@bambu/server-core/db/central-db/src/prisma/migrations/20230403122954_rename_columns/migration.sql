-- DropForeignKey
ALTER TABLE "tenant_http_urls" DROP CONSTRAINT "tenant_http_urls_tenantId_fkey";

-- AlterTable
ALTER TABLE "tenant_http_urls" ALTER COLUMN "tenant_id" SET DATA TYPE TEXT;

-- RenameForeignKey
ALTER TABLE "connect_advisor" RENAME CONSTRAINT "connect_advisor_tenantId_fkey" TO "connect_advisor_tenant_id_fkey";

-- RenameForeignKey
ALTER TABLE "otp" RENAME CONSTRAINT "otp_tenantId_fkey" TO "otp_tenant_id_fkey";

-- RenameForeignKey
ALTER TABLE "otp" RENAME CONSTRAINT "otp_userId_fkey" TO "otp_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "user" RENAME CONSTRAINT "user_tenantId_fkey" TO "user_tenant_id_fkey";

-- AddForeignKey
ALTER TABLE "tenant_http_urls" ADD CONSTRAINT "tenant_http_urls_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
