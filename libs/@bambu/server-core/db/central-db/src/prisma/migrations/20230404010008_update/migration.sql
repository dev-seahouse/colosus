-- CreateTable
CREATE TABLE "connect_portfolio_summary" (
    "id" VARCHAR(36) NOT NULL,
    "tenantId" VARCHAR(36) NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1023) NOT NULL,
    "sort_key" INTEGER NOT NULL,
    "expected_return_percent" DECIMAL(10,7) NOT NULL,
    "expected_volatility_percent" DECIMAL(10,7) NOT NULL,
    "show_summary_statistics" BOOLEAN NOT NULL,
    "reviewed" BOOLEAN NOT NULL,
    "asset_class_allocation" JSONB NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "connect_portfolio_summary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "connect_portfolio_summary_sort_key_key" ON "connect_portfolio_summary"("sort_key");

-- CreateIndex
CREATE UNIQUE INDEX "connect_portfolio_summary_tenantId_key_key" ON "connect_portfolio_summary"("tenantId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "connect_portfolio_summary_tenantId_sort_key_key" ON "connect_portfolio_summary"("tenantId", "sort_key");

-- AddForeignKey
ALTER TABLE "connect_portfolio_summary" ADD CONSTRAINT "connect_portfolio_summary_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
