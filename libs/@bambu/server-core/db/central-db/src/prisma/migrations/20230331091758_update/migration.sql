/*
  Warnings:

  - A unique constraint covering the columns `[key_type,tenant_id]` on the table `tenant_api_keys` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tenant_api_keys_key_type_tenant_id_key" ON "tenant_api_keys"("key_type", "tenant_id");
