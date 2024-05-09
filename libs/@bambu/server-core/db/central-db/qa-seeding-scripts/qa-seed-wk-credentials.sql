CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO tenant_api_keys (id,
                             key_type,
                             key_config,
                             created_by,
                             created_at,
                             updated_by,
                             updated_at,
                             tenant_id)
SELECT uuid_generate_v4(),
       'WEALTH_KERNEL_API',
       '{ "encryptedConfig": "LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3VjREb1dYKzZjSW9ITEFTQVFkQWZWZVE3ZHhpZndUVW5pQTVFUU13TmVpN251SDBBbDhjS2pXZ1pLYXkKd2k4d3V2R1FNVU1VSEh4cEQ2NW1XOHBHbFoxZ3lMZnhocjlyNWVMLzl3RC9qUGhKaFpkclVibC9qOWtICnVPSEJnaXBqMHNCVUFiUXdjdGsrRVNXMUFNdlVYZTBpV2srdXVDYmJ1OXhWSlB5d2ZpMzZyc3lsWHkvdQp3WVZsQm1VRnFuN3lOVEExN1JrZ2wxQU1TQzJKNzJIWkxvS0RqVC9kNkdIWlgyN2MyOXpzNDk0WklVS0cKTm5aaUFmMXNGOHl4eTdUY2NDdWhjMEQ2QWtrbFEzVi9BRldzb2pZcHF4MXZDQ3labG9EdnNIL2kwbkpICkdkMkFrdEdOL2hkNG83d1dkVEk0dGl3a3VkQktpNnZ2TmRyaHgrQlFhWHVCMktCb0diUGlBM2kzcVpwdwpwR3dEYzlnOGo4M3gwWVVZL1hkRjVhcVhhcnlWdysxSDZaYmE5d1dyWUxSNHY2QlRkVnpuc0hyS1B2S0MKMjlyTTdlS3ozUTVSU2VOQmdUTGRvTzZEM0xScWJRdlZLdTJ6VVJUc1JRSXhpV1ZXN1hGcG5kM3N3cEhTCjZyNlBJSDZ3L0FLaE55Z2hDcFcwCj10VVFzCi0tLS0tRU5EIFBHUCBNRVNTQUdFLS0tLS0K" }',
       'BAMBU_OPS_TEAM',
       NOW(),
       'BAMBU_OPS_TEAM',
       NOW(),
       tenant_subscriptions.tenant_id
FROM public.tenant_subscriptions
WHERE id IN (SELECT id
             FROM public.tenant_subscriptions
             WHERE tenant_subscriptions.bambu_go_product_id = 'TRANSACT'
               AND tenant_subscriptions.is_interested_in_transact = true
) AND tenant_subscriptions.tenant_id NOT IN (SELECT tenant_id
                                             FROM tenant_api_keys
                                             WHERE key_type = 'WEALTH_KERNEL_API');
