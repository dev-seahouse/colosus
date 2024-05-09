-- CreateTable
CREATE TABLE "investors" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(255) NOT NULL,
    "zip_code" VARCHAR(255),
    "age" INTEGER NOT NULL,
    "income_per_annum" INTEGER,
    "current_savings" INTEGER,
    "monthly_savings" DECIMAL(65,30),
    "is_retired" BOOLEAN NOT NULL,
    "is_employed" BOOLEAN NOT NULL,
    "type" VARCHAR(255) NOT NULL DEFAULT 'LEAD',
    "data" JSONB,
    "tenant_id" VARCHAR(36) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" VARCHAR(36) NOT NULL,
    "goal_name" VARCHAR(255) NOT NULL,
    "goal_description" VARCHAR(255) NOT NULL,
    "goal_value" DECIMAL(65,30) NOT NULL,
    "goal_timeframe" DOUBLE PRECISION NOT NULL,
    "initial_investment" DECIMAL(65,30) NOT NULL,
    "goal_start_date" TIMESTAMP(3),
    "goal_end_date" TIMESTAMP(3),
    "status" VARCHAR(255) NOT NULL DEFAULT 'PENDING',
    "computed_risk_profile" JSONB,
    "send_lead_appointment_email" BOOLEAN NOT NULL DEFAULT false,
    "send_lead_goal_projection_email" BOOLEAN NOT NULL DEFAULT false,
    "investor_id" VARCHAR(36) NOT NULL,
    "connect_portfolio_summary_id" VARCHAR(36) NOT NULL,
    "data" JSONB,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_recurring_savings_plans" (
    "id" VARCHAR(36) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" VARCHAR(255) NOT NULL,
    "frequency" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL DEFAULT 'PENDING',
    "data" JSONB,
    "goal_id" VARCHAR(36) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goal_recurring_savings_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "investors_email_key" ON "investors"("email");

-- AddForeignKey
ALTER TABLE "investors" ADD CONSTRAINT "investors_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "investors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_connect_portfolio_summary_id_fkey" FOREIGN KEY ("connect_portfolio_summary_id") REFERENCES "connect_portfolio_summary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_recurring_savings_plans" ADD CONSTRAINT "goal_recurring_savings_plans_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
