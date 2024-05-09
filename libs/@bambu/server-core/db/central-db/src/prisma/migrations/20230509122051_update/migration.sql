ALTER TABLE "leads"
  ADD COLUMN "initial_investment"         DECIMAL(65, 30),
  ADD COLUMN "monthly_contribution"       DECIMAL(65, 30),
  ADD COLUMN "projected_returns"          JSONB,
  ADD COLUMN "send_goal_projection_email" BOOLEAN NOT NULL DEFAULT false;

UPDATE leads
SET initial_investment   = 0.0,
    monthly_contribution = 0.0,
    projected_returns = '{ "high": 0, "low": 0, "target": 0 }';

ALTER TABLE leads
  ALTER COLUMN initial_investment   SET NOT NULL,
  ALTER COLUMN monthly_contribution SET NOT NULL,
  ALTER COLUMN projected_returns    SET NOT NULL;
