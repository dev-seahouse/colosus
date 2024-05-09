UPDATE connect_tenant
SET setup_state = jsonb_set(setup_state, '{hasUpdatedLeadSettings}', 'false'::jsonb),
    updated_by  = 'COLOSSUS',
    updated_at  = NOW()
WHERE NOT (setup_state ? 'hasUpdatedLeadSettings');

UPDATE connect_tenant
SET income_threshold = 100000
WHERE income_threshold <> 100000;

UPDATE connect_tenant
SET retiree_savings_threshold = 200000
WHERE retiree_savings_threshold <> 200000;

SELECT id,
       tenant_id,
       user_id,
       minimum_annual_income_threshold,
       minimum_retirement_savings_threshold,
       created_at,
       created_by,
       updated_at,
       updated_by
FROM connect_advisor_preferences;

INSERT INTO connect_advisor_preferences
SELECT uuid_in(overlay(overlay(md5(random()::text || ':' || random()::text) placing '4' from 13) placing
                       to_hex(floor(random() * (11 - 8 + 1) + 8)::int)::text from 17)::cstring) as id,
       connect_advisor.tenant_id,
       connect_advisor."userId"                                                                 AS user_id,
       connect_tenant.income_threshold                                                          AS minimum_annual_income_threshold,
       connect_tenant.retiree_savings_threshold                                                 AS minimum_retirement_savings_threshold,
       NOW()                                                                                    AS created_at,
       'COLOSSUS'                                                                               AS created_by,
       NOW()                                                                                    AS updated_at,
       'COLOSSUS'                                                                               AS updated_by
FROM connect_advisor
       INNER JOIN connect_tenant ON connect_advisor.tenant_id = connect_tenant.tenant_id
WHERE connect_advisor."userId" NOT IN (SELECT connect_advisor_preferences.user_id FROM connect_advisor_preferences)
  AND connect_advisor.tenant_id NOT IN (SELECT connect_advisor_preferences.tenant_id FROM connect_advisor_preferences);

SELECT id,
       tenant_id,
       user_id,
       minimum_annual_income_threshold,
       minimum_retirement_savings_threshold,
       created_at,
       created_by,
       updated_at,
       updated_by
FROM connect_advisor_preferences;
