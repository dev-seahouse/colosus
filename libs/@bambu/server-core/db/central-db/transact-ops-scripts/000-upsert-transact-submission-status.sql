/**
  Script to upsert (update/insert) a row into the tenant_transact_brokerages table.
  This is used to setup transact stuff.
 */
INSERT INTO tenant_transact_brokerages (id,
                                        brokerage,
                                        country,
                                        region,
                                        status,
                                        tenant_id,
                                        created_by,
                                        created_at,
                                        updated_by,
                                        updated_at)
SELECT id,
       'WealthKernel'           AS brokerage,
       'UK'                     AS country,
       null                     AS region,
       'PENDING'                AS status,
       id                       AS tenant_id,
       'COLOSSUS_UPDATE_SCRIPT' AS created_by,
       NOW()                    AS created_at,
       'COLOSSUS_UPDATE_SCRIPT' AS updated_by,
       NOW()                    AS updated_at
FROM tenants
WHERE tenants.id = 'c1f400b5-6aeb-48fa-a38e-c1f30cf716de'
ON CONFLICT (id) DO UPDATE SET brokerage  = EXCLUDED.brokerage,
                               country    = EXCLUDED.country,
                               region     = EXCLUDED.region,
                               status     = EXCLUDED.status,
                               tenant_id  = EXCLUDED.tenant_id,
                               updated_by = EXCLUDED.updated_by,
                               updated_at = EXCLUDED.updated_at;
