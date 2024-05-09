-- CreateIndex
CREATE UNIQUE INDEX "leads_unique_key" ON "leads" ("tenant_id","email");

-- DropIndex
DROP INDEX "leads_email_key";
