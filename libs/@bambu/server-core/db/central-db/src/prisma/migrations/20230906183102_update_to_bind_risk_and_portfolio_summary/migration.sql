-- Enable UUID extension for PGSQL
CREATE
  EXTENSION IF NOT EXISTS "uuid-ossp";

DO
$$
  DECLARE
    tenant_row RECORD;
    risk_profiles
               JSONB := '[
      {
        "lowerLimit": 1,
        "upperLimit": 1,
        "riskProfileName": "Low Risk",
        "riskProfileDescription": "You don’t want to experience volatility in your portfolio.<br/>You don’t expect the value of your portfolio to go down at any point in time.<br/>You should also understand that expected returns are very low."
      },
      {
        "lowerLimit": 2,
        "upperLimit": 2,
        "riskProfileName": "Medium-Low Risk",
        "riskProfileDescription": "You are OK with a bit of volatility in your portfolio.<br/>You expect the value of your portfolio to go down but just for a short period of time before it bounces back.<br/>You also understand that expected returns are low."
      },
      {
        "lowerLimit": 3,
        "upperLimit": 3,
        "riskProfileName": "Medium Risk",
        "riskProfileDescription": "You are OK with some volatility in your portfolio.<br/>You expect the value of your portfolio to to go down but just for a moderate period of time before it bounces back.<br/>You also understand that expected returns are average."
      },
      {
        "lowerLimit": 4,
        "upperLimit": 4,
        "riskProfileName": "Medium-High Risk",
        "riskProfileDescription": "You are OK with volatility in your portfolio.<br/>You expect the value of your portfolio to to go down but just for a significant period of time but it should bounce back.<br/>You expect good returns in the mid to long term."
      },
      {
        "lowerLimit": 5,
        "upperLimit": 5,
        "riskProfileName": "High Risk",
        "riskProfileDescription": "You are OK with high volatility in your portfolio.<br/>You expect the value of your portfolio to to go down sharply at one point in time but you know that you will reap huge benefits if you are patient enough.<br/>You expect high returns in the long term."
      }
    ]'::jsonb;
    risk_profile
               JSONB;
  BEGIN
    FOR tenant_row IN (SELECT *
                       FROM tenants
                       WHERE id NOT IN (SELECT DISTINCT risk_profiles.tenant_id FROM risk_profiles))
      LOOP
        -- Loop through each risk profile and insert it for the tenant
        FOR risk_profile IN
          SELECT *
          FROM jsonb_array_elements(risk_profiles)
          LOOP
            INSERT
            INTO risk_profiles (id,
                                tenant_id,
                                lower_limit,
                                upper_limit,
                                risk_profile_name,
                                risk_profile_description,
                                created_by,
                                updated_by,
                                created_at,
                                updated_at)
            VALUES (uuid_generate_v4(), tenant_row.id, (risk_profile ->> 'lowerLimit'):: NUMERIC,
                    (risk_profile ->> 'upperLimit'):: NUMERIC, risk_profile ->> 'riskProfileName',
                    risk_profile ->> 'riskProfileDescription', 'COLOSSUS MIGRATION SCRIPT',
                    'COLOSSUS MIGRATION SCRIPT', NOW(), NOW());
          END LOOP;
      END LOOP;
  EXCEPTION
    WHEN others THEN
      RAISE EXCEPTION 'An error occurred while migrating risk profiles of existing users: %', SQLERRM;
  END
$$;

-- AlterTable first round for migration
ALTER TABLE "connect_portfolio_summary"
  ADD COLUMN "risk_profile_id" VARCHAR(36);

DO
$$
  DECLARE
    row          connect_portfolio_summary%ROWTYPE;
    target_value VARCHAR(36) := NULL;
  BEGIN
    FOR row IN (SELECT * FROM connect_portfolio_summary WHERE risk_profile_id IS NULL)
      LOOP
        target_value := NULL;
        CASE
          WHEN row.key = 'CONSERVATIVE' THEN -- Get the id into a variable
          SELECT id
          INTO target_value
          FROM risk_profiles
          WHERE risk_profiles.tenant_id = row."tenantId"
            AND risk_profiles.lower_limit = 1
            AND risk_profiles.lower_limit = 1;
          WHEN row.key = 'MODERATE' THEN SELECT id
                                         INTO target_value
                                         FROM risk_profiles
                                         WHERE risk_profiles.tenant_id = row."tenantId"
                                           AND risk_profiles.lower_limit = 2
                                           AND risk_profiles.upper_limit = 2;
          WHEN row.key = 'BALANCED' THEN SELECT id
                                         INTO target_value
                                         FROM risk_profiles
                                         WHERE risk_profiles.tenant_id = row."tenantId"
                                           AND risk_profiles.lower_limit = 3
                                           AND risk_profiles.upper_limit = 3;
          WHEN row.key = 'GROWTH' THEN SELECT id
                                       INTO target_value
                                       FROM risk_profiles
                                       WHERE risk_profiles.tenant_id = row."tenantId"
                                         AND risk_profiles.lower_limit = 4
                                         AND risk_profiles.upper_limit = 4;
          WHEN row.key = 'AGGRESSIVE' THEN SELECT id
                                           INTO target_value
                                           FROM risk_profiles
                                           WHERE risk_profiles.tenant_id = row."tenantId"
                                             AND risk_profiles.lower_limit = 5
                                             AND risk_profiles.upper_limit = 5;
          END CASE;

        UPDATE connect_portfolio_summary
        SET risk_profile_id = target_value
        WHERE id = row.id;
      END LOOP;

    -- Check for NULL values in risk_profile_id before setting NOT NULL
    IF EXISTS (SELECT 1 FROM "connect_portfolio_summary" WHERE "risk_profile_id" IS NULL) THEN
      RAISE EXCEPTION 'There are NULL values in risk_profile_id column. Cannot set to NOT NULL';
    END IF;

    -- AlterTable post migration
    ALTER TABLE "connect_portfolio_summary"
      ALTER COLUMN "risk_profile_id" SET NOT NULL;

-- AddForeignKey
    ALTER TABLE "connect_portfolio_summary"
      ADD CONSTRAINT "connect_portfolio_summary_risk_profile_id_fkey" FOREIGN KEY ("risk_profile_id") REFERENCES "risk_profiles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  EXCEPTION
    WHEN others THEN
      ALTER TABLE public.connect_portfolio_summary
        DROP COLUMN risk_profile_id;

      RAISE EXCEPTION 'An error occurred while binding portfolio summaries to risk profiles: %', SQLERRM;
  END
$$;

