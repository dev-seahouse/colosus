-- CreateTable
CREATE TABLE "risk_profiles" (
    "id" VARCHAR(36) NOT NULL,
    "lower_limit" DECIMAL(65,30) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "risk_profiles_pkey" PRIMARY KEY ("id")
);
