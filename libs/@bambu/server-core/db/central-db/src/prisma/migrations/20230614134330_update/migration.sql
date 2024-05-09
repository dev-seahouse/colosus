-- AlterTable
ALTER TABLE "tenants"
  ADD COLUMN "linked_to_fusion_auth" BOOLEAN NOT NULL DEFAULT false;
