/*
  Warnings:

  - You are about to drop the `connect_advisor_lead_settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "connect_advisor_lead_settings" DROP CONSTRAINT "connect_advisor_lead_settings_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "connect_advisor_lead_settings" DROP CONSTRAINT "connect_advisor_lead_settings_user_id_fkey";

-- DropTable
DROP TABLE "connect_advisor_lead_settings";

-- CreateTable
CREATE TABLE "connect_advisor_lead_review_settings" (
    "id" VARCHAR(36) NOT NULL,
    "tenant_id" VARCHAR(36) NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,
    "minimum_annual_income_threshold" DOUBLE PRECISION,
    "minimum_retirement_savings_threshold" DOUBLE PRECISION,

    CONSTRAINT "connect_advisor_lead_review_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "connect_advisor_lead_review_settings_tenant_id_user_id_key" ON "connect_advisor_lead_review_settings"("tenant_id", "user_id");

-- AddForeignKey
ALTER TABLE "connect_advisor_lead_review_settings" ADD CONSTRAINT "connect_advisor_lead_review_settings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connect_advisor_lead_review_settings" ADD CONSTRAINT "connect_advisor_lead_review_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
