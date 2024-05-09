-- CreateEnum
CREATE TYPE "OtpMode" AS ENUM ('EMAIL');

-- CreateEnum
CREATE TYPE "OtpState" AS ENUM ('UNUSED', 'INVALIDATED', 'USED');

-- CreateTable
CREATE TABLE "user" (
    "id" VARCHAR(36) NOT NULL,
    "tenantId" VARCHAR(36),
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp" (
    "id" VARCHAR(36) NOT NULL,
    "tenantId" VARCHAR(36),
    "userId" VARCHAR(36),
    "otp" VARCHAR(255) NOT NULL,
    "purpose" VARCHAR(255) NOT NULL,
    "mode" "OtpMode" NOT NULL,
    "otpState" "OtpState" NOT NULL DEFAULT 'UNUSED',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp" ADD CONSTRAINT "otp_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp" ADD CONSTRAINT "otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
