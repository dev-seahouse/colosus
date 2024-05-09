UPDATE connect_portfolio_summary
SET asset_class_allocation = jsonb_set(
  asset_class_allocation,
  ARRAY [(idx - 1)::text],
  (item - 'assetClass') || jsonb_build_object('assetClass', 'Cash')
                             )
FROM (SELECT id, idx, item
      FROM connect_portfolio_summary,
           LATERAL jsonb_array_elements(asset_class_allocation) WITH ORDINALITY arr(item, idx)
      WHERE item ->> 'assetClass' = 'Money Market') sub
WHERE connect_portfolio_summary.id = sub.id;

UPDATE connect_portfolio_summary
SET asset_class_allocation = (SELECT jsonb_agg(item ORDER BY (item ->> 'assetClass' = 'Cash'), idx)
                              FROM (SELECT item, idx
                                    FROM jsonb_array_elements(asset_class_allocation) WITH ORDINALITY AS arr(item, idx)) sub)
WHERE asset_class_allocation @> '[{"assetClass": "Cash"}]';
