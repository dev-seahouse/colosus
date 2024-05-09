/*
  Warnings:

  - Added the required column `bambu_go_product_id` to the `tenant_subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tenant_subscriptions" ADD COLUMN     "bambu_go_product_id" TEXT NOT NULL;
