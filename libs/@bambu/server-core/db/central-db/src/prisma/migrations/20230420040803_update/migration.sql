-- CreateTable
CREATE TABLE "legal_document_set" (
    "id" VARCHAR(36) NOT NULL,
    "tenant_id" VARCHAR(36) NOT NULL,
    "documentUrls" JSONB NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "legal_document_set_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "legal_document_set_tenant_id_key" ON "legal_document_set"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "legal_document_set_tenant_id_created_at_key" ON "legal_document_set"("tenant_id", "created_at");

-- AddForeignKey
ALTER TABLE "legal_document_set" ADD CONSTRAINT "legal_document_set_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
