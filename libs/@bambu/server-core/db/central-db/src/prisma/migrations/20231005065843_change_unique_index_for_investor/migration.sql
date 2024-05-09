/*
  Warnings:

  - A unique constraint covering the columns `[email,tenant_id]` on the table `investors` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "investors_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "investors_email_tenant_id_key" ON "investors"("email", "tenant_id");
