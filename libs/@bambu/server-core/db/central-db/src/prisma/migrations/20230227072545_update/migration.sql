/*
  Warnings:

  - You are about to drop the `tennant_api_keys` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tennants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tennant_api_keys" DROP CONSTRAINT "tennant_api_keys_tennant_id_fkey";

-- DropTable
DROP TABLE "tennant_api_keys";

-- DropTable
DROP TABLE "tennants";

-- CreateTable
CREATE TABLE "tenants" (
    "id" VARCHAR(36) NOT NULL,
    "realm" VARCHAR(255) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_api_keys" (
    "id" VARCHAR(36) NOT NULL,
    "tennant_id" TEXT,
    "key_type" VARCHAR(255) NOT NULL,
    "key_config" JSONB NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_http_urls" (
    "id" VARCHAR(36) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" VARCHAR(36),

    CONSTRAINT "tenant_http_urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_realm_key" ON "tenants"("realm");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_http_urls_url_key" ON "tenant_http_urls"("url");

-- AddForeignKey
ALTER TABLE "tenant_api_keys" ADD CONSTRAINT "tenant_api_keys_tennant_id_fkey" FOREIGN KEY ("tennant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_http_urls" ADD CONSTRAINT "tenant_http_urls_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
