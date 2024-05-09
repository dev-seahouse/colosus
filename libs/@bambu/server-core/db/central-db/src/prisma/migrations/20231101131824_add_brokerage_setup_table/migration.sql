-- CreateTable
CREATE TABLE "tenant_transact_brokerages" (
    "id" VARCHAR(36) NOT NULL,
    "brokerage" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "region" VARCHAR(255),
    "status" VARCHAR(255),
    "tenant_id" VARCHAR(36),
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_transact_brokerages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenant_transact_brokerages_brokerage_tenant_id_key" ON "tenant_transact_brokerages"("brokerage", "tenant_id");

-- AddForeignKey
ALTER TABLE "tenant_transact_brokerages" ADD CONSTRAINT "tenant_transact_brokerages_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
