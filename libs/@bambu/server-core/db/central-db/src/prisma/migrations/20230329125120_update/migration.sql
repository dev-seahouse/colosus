/*
  Warnings:

  - The primary key for the `tenant_subscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "tenant_subscriptions" DROP CONSTRAINT "tenant_subscriptions_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "tenant_subscriptions_pkey" PRIMARY KEY ("id");
