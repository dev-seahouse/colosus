/*
  Changes data host name for logoUrl in tenant_branding table
 */

UPDATE tenant_branding
SET branding = jsonb_set(branding, '{logoUrl}'::text[], to_json(data_set.newLogoUrl)::jsonb)
FROM (SELECT id,
             tenant_id,
             'https://bambugoprodwebtenant.blob.core.windows.net/%24web' ||
             split_part(branding ->> 'logoUrl', '%24web', 2) as newLogoUrl
      FROM tenant_branding
      WHERE branding ->> 'logoUrl' IS NOT NULL
        AND TRIM(branding ->> 'logoUrl') <> '') AS data_set
WHERE data_set.id = tenant_branding.id;
