-- CreateTable
CREATE TABLE "transact_model_portfolios" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255),
    "description" TEXT,
    "expected_annual_return" DECIMAL(10,8),
    "expected_annual_volatility" DECIMAL(10,8),
    "rebalancing_threshold" DECIMAL(10,8),
    "fact_sheet_url" TEXT,
    "partner_model_id" TEXT,
    "connect_portfolio_summary_id" VARCHAR(36) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transact_model_portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transact_portfolio_instruments" (
    "id" VARCHAR(36) NOT NULL,
    "weightage" DECIMAL(10,8) NOT NULL,
    "instrument_id" VARCHAR(36) NOT NULL,
    "transact_model_portfolio_id" VARCHAR(36) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transact_portfolio_instruments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transact_model_portfolios" ADD CONSTRAINT "transact_model_portfolios_connect_portfolio_summary_id_fkey" FOREIGN KEY ("connect_portfolio_summary_id") REFERENCES "connect_portfolio_summary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transact_portfolio_instruments" ADD CONSTRAINT "transact_portfolio_instruments_instrument_id_fkey" FOREIGN KEY ("instrument_id") REFERENCES "instruments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transact_portfolio_instruments" ADD CONSTRAINT "transact_portfolio_instruments_transact_model_portfolio_id_fkey" FOREIGN KEY ("transact_model_portfolio_id") REFERENCES "transact_model_portfolios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
