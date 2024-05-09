-- CreateTable
CREATE TABLE "leads" (
    "id" VARCHAR(36) NOT NULL,
    "tenant_id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(255) NOT NULL,
    "zip_code" VARCHAR(255) NOT NULL,
    "age" INTEGER NOT NULL,
    "income_per_annum" INTEGER,
    "current_savings" INTEGER,
    "is_retired" BOOLEAN NOT NULL,
    "goal_description" VARCHAR(255) NOT NULL,
    "goal_name" VARCHAR(255) NOT NULL,
    "goal_value" DOUBLE PRECISION NOT NULL,
    "goal_timeframe" DOUBLE PRECISION NOT NULL,
    "risk_appetite" VARCHAR(255) NOT NULL,
    "notes" VARCHAR(1023) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leads_email_key" ON "leads"("email");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_risk_appetite_fkey" FOREIGN KEY ("risk_appetite") REFERENCES "connect_portfolio_summary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
