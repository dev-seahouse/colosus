-- AlterTable
ALTER TABLE "otp" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "tenant_api_keys" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "tenant_http_urls" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "updated_at" DROP DEFAULT;
