/*
  Warnings:

  - You are about to drop the column `income_threshold` on the `connect_advisor` table. All the data in the column will be lost.
  - You are about to drop the column `retiree_savings_threshold` on the `connect_advisor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "connect_advisor" DROP COLUMN "income_threshold",
DROP COLUMN "retiree_savings_threshold";

-- CreateTable
CREATE TABLE "connect_advisor_lead_settings" (
    "id" VARCHAR(36) NOT NULL,
    "tenant_id" VARCHAR(36) NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,
    "minimum_annual_income_threshold" DOUBLE PRECISION,
    "minimum_retirement_savings_threshold" DOUBLE PRECISION,

    CONSTRAINT "connect_advisor_lead_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "connect_advisor_lead_settings_tenant_id_user_id_key" ON "connect_advisor_lead_settings"("tenant_id", "user_id");

-- AddForeignKey
ALTER TABLE "connect_advisor_lead_settings" ADD CONSTRAINT "connect_advisor_lead_settings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connect_advisor_lead_settings" ADD CONSTRAINT "connect_advisor_lead_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
