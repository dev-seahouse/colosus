/**
  This was written to migrate the "DEV" investor URLs to the new format.

  This should only be applied once we have the proxy and DNS setup that delineates between DEV and PROD.
*/

UPDATE tenant_http_urls
SET url = data_set.new_url
FROM (SELECT id,
             'https://' || REPLACE(REPLACE(split_part(url, '.', 1), 'https://', ''), 'http://', '') ||
             '.dev.go-bambu.co' as new_url
      FROM tenant_http_urls
      WHERE tenant_http_urls.url like '%go-bambu.co%') AS data_set
WHERE tenant_http_urls.id = data_set.id
