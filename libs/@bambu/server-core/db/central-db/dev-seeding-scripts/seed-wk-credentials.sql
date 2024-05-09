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
       '{ "encryptedConfig": "LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3VjREMUk4OFpNaldsZ29TQVFkQXFuN1p0NkduUEkzdlpSbWF3RnorRVBIenlZNFQ5K1BhNGZwMHFPbnAKMG1Fd3hhMkpWYTVWRGhsSVpzMU1oN3JSOWhjUGZxR3hzRnF4QUZzVTBCN0RPZWpFdkFQU0Z5Yk8xeW9BCmZOUEUrNnJNMHNCVUFTRzRyU0hrblFXQVFLNm00dXlXU0ZsSDBFaXo3ajB5N1gxNlgzU0FUcnkvZ2JBTgpGdkE0cjFwUlBzV2F2VU9rN1VTRnNRNFNZMlVtZ0xmK0JJRkhxQTMrQ1ZsZktWZXd0OHNxSGRGVGgxcFAKZjlwRC9obW9pWml3enFycFZqY2xRd3IzV0tSYTl5KzR2VnA1QUhzSXBwWVBnUFFoYkJNYlBPcEFhaGpsCng5V3V3THdWWk9WRzFFenh0Q1NueFdNRlg3NytOMmc4ZVJxOWFUaElNcTZTVEpiQzhXMW5ZYVhSQkNwNApxaUhiSmFWblFnNFBrYncxNFQ3NEtIVDB5WERGR2ROMUZYVWxaZFZ1Yk13bHQxeUhwR0JHa0pCaFVJeFUKc2hrTkRDcE5RajZzd0VOUVU3MEIzbkdDWjNNZG9pemVzcUppWkdyWngwRml2OTlYQnpkYmRadVFtNVJiClI2TStMQnVldGMybmtvdHI3ZDl5Cj1Ca3MzCi0tLS0tRU5EIFBHUCBNRVNTQUdFLS0tLS0K" }',
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
