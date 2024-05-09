INSERT INTO public.investors (id, name, email, phone_number, zip_code, age, income_per_annum, current_savings,
                              monthly_savings, is_retired, is_employed, type, tenant_id, created_by,
                              created_at, updated_by, updated_at, lead_review_status)
SELECT id,
       name,
       email,
       phone_number,
       zip_code,
       age,
       income_per_annum,
       current_savings,
       monthly_savings,
       is_retired,
       NOT is_retired AS is_employed,
       'LEAD',
       tenant_id,
       created_by,
       created_at,
       updated_by,
       updated_at,
       status
FROM public.leads
ON CONFLICT (id)
  DO UPDATE SET name             = EXCLUDED.name,
                email            = EXCLUDED.email,
                phone_number     = EXCLUDED.phone_number,
                zip_code         = EXCLUDED.zip_code,
                age              = EXCLUDED.age,
                income_per_annum = EXCLUDED.income_per_annum,
                current_savings  = EXCLUDED.current_savings,
                monthly_savings  = EXCLUDED.monthly_savings,
                is_retired       = EXCLUDED.is_retired,
                is_employed      = NOT EXCLUDED.is_retired,
                updated_by       = EXCLUDED.updated_by,
                updated_at       = NOW();

INSERT INTO public.goals (id, goal_name, goal_description, goal_value, goal_timeframe, initial_investment,
                          computed_risk_profile, investor_id, connect_portfolio_summary_id, created_by,
                          created_at, updated_by, updated_at)
SELECT id,
       goal_name,
       goal_description,
       goal_value,
       goal_timeframe,
       initial_investment,
       computed_risk_profile,
       id AS investor_id,
       risk_appetite,
       created_by,
       created_at,
       updated_by,
       updated_at
FROM public.leads
ON CONFLICT (id)
  DO UPDATE SET goal_name                    = excluded.goal_name,
                goal_description             = excluded.goal_description,
                goal_value                   = excluded.goal_value,
                goal_timeframe               = excluded.goal_timeframe,
                initial_investment           = excluded.initial_investment,
                computed_risk_profile        = excluded.computed_risk_profile,
                investor_id                  = excluded.investor_id,
                connect_portfolio_summary_id = excluded.connect_portfolio_summary_id,
                updated_by                   = excluded.updated_by,
                updated_at                   = NOW();

INSERT INTO public.goal_recurring_savings_plans (id, amount, currency, frequency, goal_id, created_by, created_at,
                                                 updated_by, updated_at)
SELECT id,
       monthly_contribution,
       'USD',
       'MONTHLY',
       id AS goal_id,
       created_by,
       created_at,
       updated_by,
       updated_at
FROM public.leads
WHERE monthly_contribution > 0
ON CONFLICT (id)
  DO UPDATE SET amount     = excluded.amount,
                currency   = excluded.currency,
                frequency  = excluded.frequency,
                goal_id    = excluded.goal_id,
                updated_by = excluded.updated_by,
                updated_at = NOW();
