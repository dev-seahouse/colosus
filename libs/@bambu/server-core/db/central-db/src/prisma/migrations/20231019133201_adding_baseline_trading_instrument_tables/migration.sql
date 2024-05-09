-- CreateTable
CREATE TABLE "instrument_asset_classes" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'QUARK',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'QUARK',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instrument_asset_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instrument_exchanges" (
    "id" VARCHAR(36) NOT NULL,
    "bambu_exchange_code" VARCHAR(255) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'QUARK',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'QUARK',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instrument_exchanges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instrument_currencies" (
    "id" VARCHAR(36) NOT NULL,
    "iso_4217_code" VARCHAR(255) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'QUARK',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'QUARK',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instrument_currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instruments" (
    "id" TEXT NOT NULL,
    "bloomberg_ticker" VARCHAR(255),
    "ric_symbol" VARCHAR(255),
    "isin" VARCHAR(255),
    "cusip" VARCHAR(255),
    "name" TEXT NOT NULL,
    "instrument_asset_class_id" VARCHAR(36) NOT NULL,
    "instrument_exchange_id" VARCHAR(36) NOT NULL,
    "instrument_currency_id" VARCHAR(36) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'QUARK',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'QUARK',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instruments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instrument_fact_sheets" (
    "id" VARCHAR(36) NOT NULL,
    "url" TEXT NOT NULL,
    "instrument_id" VARCHAR(36) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'QUARK',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'QUARK',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instrument_fact_sheets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "instrument_asset_classes_name_key" ON "instrument_asset_classes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "instrument_exchanges_bambu_exchange_code_key" ON "instrument_exchanges"("bambu_exchange_code");

-- CreateIndex
CREATE UNIQUE INDEX "instrument_currencies_iso_4217_code_key" ON "instrument_currencies"("iso_4217_code");

-- CreateIndex
CREATE UNIQUE INDEX "instrument_fact_sheets_url_instrument_id_key" ON "instrument_fact_sheets"("url", "instrument_id");

-- AddForeignKey
ALTER TABLE "instruments" ADD CONSTRAINT "instruments_instrument_asset_class_id_fkey" FOREIGN KEY ("instrument_asset_class_id") REFERENCES "instrument_asset_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instruments" ADD CONSTRAINT "instruments_instrument_exchange_id_fkey" FOREIGN KEY ("instrument_exchange_id") REFERENCES "instrument_exchanges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instruments" ADD CONSTRAINT "instruments_instrument_currency_id_fkey" FOREIGN KEY ("instrument_currency_id") REFERENCES "instrument_currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instrument_fact_sheets" ADD CONSTRAINT "instrument_fact_sheets_instrument_id_fkey" FOREIGN KEY ("instrument_id") REFERENCES "instruments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
