-- AlterTable
ALTER TABLE "connect_advisor"
  ADD COLUMN "contact_link"              TEXT,
  ADD COLUMN "income_threshold"          INTEGER,
  ADD COLUMN "retiree_savings_threshold" INTEGER;

-- AlterTable
ALTER TABLE "connect_tenant"
  ADD COLUMN "contact_link" TEXT;
