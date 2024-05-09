/*
  Warnings:

  - A unique constraint covering the columns `[tenant_id]` on the table `risk_profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenant_id` to the `risk_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "risk_profiles" ADD COLUMN     "tenant_id" VARCHAR(36) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "risk_profiles_tenant_id_key" ON "risk_profiles"("tenant_id");

-- AddForeignKey
ALTER TABLE "risk_profiles" ADD CONSTRAINT "risk_profiles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
