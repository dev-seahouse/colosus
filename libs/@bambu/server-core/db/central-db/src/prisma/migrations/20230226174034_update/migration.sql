-- CreateTable
CREATE TABLE "tennants" (
    "id" TEXT NOT NULL,
    "realm" VARCHAR(255) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tennants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tennant_api_keys" (
    "id" TEXT NOT NULL,
    "tennant_id" TEXT,
    "key_type" VARCHAR(255) NOT NULL,
    "key_config" JSONB NOT NULL,

    CONSTRAINT "tennant_api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tennants_realm_key" ON "tennants"("realm");

-- AddForeignKey
ALTER TABLE "tennant_api_keys" ADD CONSTRAINT "tennant_api_keys_tennant_id_fkey" FOREIGN KEY ("tennant_id") REFERENCES "tennants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
