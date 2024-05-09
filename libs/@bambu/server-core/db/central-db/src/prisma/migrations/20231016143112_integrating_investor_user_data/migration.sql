-- AlterTable
ALTER TABLE "otp"
  ADD COLUMN "investor_platform_user_id" VARCHAR(36);

-- CreateTable
CREATE TABLE "investor_platform_users"
(
  "id"             VARCHAR(36)  NOT NULL,
  "application_id" TEXT         NOT NULL,
  "data"           JSONB,
  "created_by"     VARCHAR(255) NOT NULL DEFAULT 'unknown',
  "created_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by"     VARCHAR(255) NOT NULL DEFAULT 'unknown',
  "updated_at"     TIMESTAMP(3) NOT NULL,
  "investor_id"    VARCHAR(36)  NOT NULL,

  CONSTRAINT "investor_platform_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_otp_user_id" ON "otp" ("user_id");

-- CreateIndex
CREATE INDEX "idx_otp_investor_platform_user_id" ON "otp" ("investor_platform_user_id");

-- AddForeignKey
ALTER TABLE "otp"
  ADD CONSTRAINT "otp_investor_platform_user_id_fkey" FOREIGN KEY ("investor_platform_user_id") REFERENCES "investor_platform_users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_platform_users"
  ADD CONSTRAINT "investor_platform_users_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "investors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "otp"
  ADD CONSTRAINT check_only_one_user_relation
    CHECK (
        ("user_id" IS NULL AND "investor_platform_user_id" IS NOT NULL) OR
        ("user_id" IS NOT NULL AND "investor_platform_user_id" IS NULL)
      );
