-- DropIndex
DROP INDEX "legal_document_set_tenant_id_key";

-- CreateTable
CREATE TABLE "connect_tenant" (
    "id" VARCHAR(36) NOT NULL,
    "tenant_id" VARCHAR(36) NOT NULL,
    "income_threshold" INTEGER NOT NULL,
    "retiree_savings_threshold" INTEGER NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "connect_tenant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "connect_tenant_tenant_id_key" ON "connect_tenant"("tenant_id");

-- AddForeignKey
ALTER TABLE "connect_tenant" ADD CONSTRAINT "connect_tenant_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
