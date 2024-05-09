/*
  Warnings:

  - A unique constraint covering the columns `[instrument_id,transact_model_portfolio_id]` on the table `transact_portfolio_instruments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "transact_portfolio_instruments_instrument_id_transact_model_key" ON "transact_portfolio_instruments"("instrument_id", "transact_model_portfolio_id");
