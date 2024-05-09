-- Migration Script to Populate Missing Risk Profiles

-- Enable UUID extension for PGSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO
$$
    DECLARE
        tenant_row    RECORD;
        risk_profiles JSONB := '[
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
        risk_profile  JSONB;
    BEGIN
        FOR tenant_row IN (SELECT *
                           FROM tenants
                           WHERE id NOT IN (SELECT DISTINCT risk_profiles.tenant_id FROM risk_profiles))
            LOOP
                -- Loop through each risk profile and insert it for the tenant
                FOR risk_profile IN SELECT * FROM jsonb_array_elements(risk_profiles)
                    LOOP
                        INSERT INTO risk_profiles (id,
                                                   tenant_id,
                                                   lower_limit,
                                                   upper_limit,
                                                   risk_profile_name,
                                                   risk_profile_description,
                                                   created_by,
                                                   updated_by,
                                                   created_at,
                                                   updated_at)
                        VALUES (uuid_generate_v4(),
                                tenant_row.id,
                                (risk_profile ->> 'lowerLimit')::NUMERIC,
                                (risk_profile ->> 'upperLimit')::NUMERIC,
                                risk_profile ->> 'riskProfileName',
                                risk_profile ->> 'riskProfileDescription',
                                'COLOSSUS MIGRATION SCRIPT',
                                'COLOSSUS MIGRATION SCRIPT',
                                NOW(),
                                NOW());
                    END LOOP;
            END LOOP;
    END
$$;
