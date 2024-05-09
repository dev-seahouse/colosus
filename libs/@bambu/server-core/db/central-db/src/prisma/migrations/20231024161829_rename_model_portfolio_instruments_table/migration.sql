/*
  Warnings:

  - You are about to drop the `transact_portfolio_instruments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "transact_portfolio_instruments" DROP CONSTRAINT "transact_portfolio_instruments_instrument_id_fkey";

-- DropForeignKey
ALTER TABLE "transact_portfolio_instruments" DROP CONSTRAINT "transact_portfolio_instruments_transact_model_portfolio_id_fkey";

-- DropTable
DROP TABLE "transact_portfolio_instruments";

-- CreateTable
CREATE TABLE "transact_model_portfolio_instruments" (
    "id" VARCHAR(36) NOT NULL,
    "weightage" DECIMAL(10,8) NOT NULL,
    "instrument_id" VARCHAR(36) NOT NULL,
    "transact_model_portfolio_id" VARCHAR(36) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transact_model_portfolio_instruments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transact_model_portfolio_instruments_instrument_id_transact_key" ON "transact_model_portfolio_instruments"("instrument_id", "transact_model_portfolio_id");

-- AddForeignKey
ALTER TABLE "transact_model_portfolio_instruments" ADD CONSTRAINT "transact_model_portfolio_instruments_instrument_id_fkey" FOREIGN KEY ("instrument_id") REFERENCES "instruments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transact_model_portfolio_instruments" ADD CONSTRAINT "transact_model_portfolio_instruments_transact_model_portfo_fkey" FOREIGN KEY ("transact_model_portfolio_id") REFERENCES "transact_model_portfolios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
