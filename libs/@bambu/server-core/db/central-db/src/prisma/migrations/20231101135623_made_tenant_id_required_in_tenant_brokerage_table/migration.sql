/*
  Warnings:

  - Made the column `tenant_id` on table `tenant_transact_brokerages` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "tenant_transact_brokerages" DROP CONSTRAINT "tenant_transact_brokerages_tenant_id_fkey";

-- AlterTable
ALTER TABLE "tenant_transact_brokerages" ALTER COLUMN "tenant_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "tenant_transact_brokerages" ADD CONSTRAINT "tenant_transact_brokerages_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
