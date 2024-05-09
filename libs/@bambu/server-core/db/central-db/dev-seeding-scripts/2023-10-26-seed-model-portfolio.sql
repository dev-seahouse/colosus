-- Aggressive Model Portfolio Setup - Start

INSERT INTO transact_model_portfolios
(id,
 name,
 description,
 expected_annual_return,
 expected_annual_volatility,
 rebalancing_threshold,
 fact_sheet_url,
 partner_model_id,
 connect_portfolio_summary_id,
 created_by,
 created_at,
 updated_by,
 updated_at)
SELECT id,
       name,
       description,
       expected_return_percent / 100     AS expected_annual_return,
       expected_volatility_percent / 100 AS expected_annual_volatility,
       0.1                               AS rebalancing_threshold,
       NULL                              as fact_sheet_url,
       'mdl-36h4zk4q6242wa'              AS partner_model_id,
       id                                AS connect_portfolio_summary_id,
       'COLOSSUS SETUP SCRIPT'           AS created_by,
       NOW()                             AS created_at,
       'COLOSSUS SETUP SCRIPT'           AS updated_by,
       NOW()                             AS updated_at
FROM connect_portfolio_summary
WHERE "key" = 'AGGRESSIVE'
  AND id NOT IN (SELECT connect_portfolio_summary_id FROM transact_model_portfolios);

INSERT INTO transact_model_portfolio_instruments
SELECT uuid_generate_v4() AS id,
       CASE
           WHEN isin = 'CASH_GBP' THEN 0.02
           WHEN isin = 'IE00BF4RFH31' THEN 0.2
           WHEN isin = 'IE00B4L5Y983' THEN 0.5
           WHEN isin = 'IE0005042456' THEN 0.28
           END            AS weightage,
       instruments.id     AS instrument_id,
       connect_portfolio_summary.id AS transact_model_portfolio_id,
       'COLOSSUS SETUP SCRIPT'           AS created_by,
       NOW()                             AS created_at,
       'COLOSSUS SETUP SCRIPT'           AS updated_by,
       NOW()                             AS updated_at
FROM instruments
         CROSS JOIN connect_portfolio_summary
WHERE isin IN ('IE0005042456', 'IE00B4L5Y983', 'IE00BF4RFH31', 'CASH_GBP')
  AND connect_portfolio_summary."key" = 'AGGRESSIVE'
  AND connect_portfolio_summary.id NOT IN
      (SELECT transact_model_portfolio_id FROM transact_model_portfolio_instruments);

-- Aggressive Model Portfolio Setup - End

-- BALANCED Model Portfolio Setup - Start

INSERT INTO transact_model_portfolios
(id,
 name,
 description,
 expected_annual_return,
 expected_annual_volatility,
 rebalancing_threshold,
 fact_sheet_url,
 partner_model_id,
 connect_portfolio_summary_id,
 created_by,
 created_at,
 updated_by,
 updated_at)
SELECT id,
       name,
       description,
       expected_return_percent / 100     AS expected_annual_return,
       expected_volatility_percent / 100 AS expected_annual_volatility,
       0.1                               AS rebalancing_threshold,
       NULL                              as fact_sheet_url,
       'mdl-36h4zk4q6242wa'              AS partner_model_id,
       id                                AS connect_portfolio_summary_id,
       'COLOSSUS SETUP SCRIPT'           AS created_by,
       NOW()                             AS created_at,
       'COLOSSUS SETUP SCRIPT'           AS updated_by,
       NOW()                             AS updated_at
FROM connect_portfolio_summary
WHERE "key" = 'BALANCED'
  AND id NOT IN (SELECT connect_portfolio_summary_id FROM transact_model_portfolios);

INSERT INTO transact_model_portfolio_instruments
SELECT uuid_generate_v4() AS id,
       CASE
           WHEN isin = 'IE00B4L5Y983' THEN 0.35
           WHEN isin = 'IE00B4WXJK79' THEN 0.25
           WHEN isin = 'IE00B00FV011' THEN 0.23
           WHEN isin = 'IE0005042456' THEN 0.15
           WHEN isin = 'CASH_GBP' THEN 0.02
           END            AS weightage,
       instruments.id     AS instrument_id,
       connect_portfolio_summary.id AS transact_model_portfolio_id,
       'COLOSSUS SETUP SCRIPT'           AS created_by,
       NOW()                             AS created_at,
       'COLOSSUS SETUP SCRIPT'           AS updated_by,
       NOW()                             AS updated_at
FROM instruments
         CROSS JOIN connect_portfolio_summary
WHERE isin IN ('IE00B4L5Y983', 'IE00B4WXJK79', 'IE00B00FV011', 'IE00B00FV011', 'CASH_GBP')
  AND connect_portfolio_summary."key" = 'BALANCED'
  AND connect_portfolio_summary.id NOT IN
      (SELECT transact_model_portfolio_id FROM transact_model_portfolio_instruments);

-- BALANCED Model Portfolio Setup - End

-- CONSERVATIVE Model Portfolio Setup - Start

INSERT INTO transact_model_portfolios
(id,
 name,
 description,
 expected_annual_return,
 expected_annual_volatility,
 rebalancing_threshold,
 fact_sheet_url,
 partner_model_id,
 connect_portfolio_summary_id,
 created_by,
 created_at,
 updated_by,
 updated_at)
SELECT id,
       name,
       description,
       expected_return_percent / 100     AS expected_annual_return,
       expected_volatility_percent / 100 AS expected_annual_volatility,
       0.1                               AS rebalancing_threshold,
       NULL                              as fact_sheet_url,
       'mdl-36h4zk4q6242wa'              AS partner_model_id,
       id                                AS connect_portfolio_summary_id,
       'COLOSSUS SETUP SCRIPT'           AS created_by,
       NOW()                             AS created_at,
       'COLOSSUS SETUP SCRIPT'           AS updated_by,
       NOW()                             AS updated_at
FROM connect_portfolio_summary
WHERE "key" = 'CONSERVATIVE'
  AND id NOT IN (SELECT connect_portfolio_summary_id FROM transact_model_portfolios);

INSERT INTO transact_model_portfolio_instruments
SELECT uuid_generate_v4() AS id,
       CASE
           WHEN isin = 'IE00B4WXJK79' THEN 0.35
           WHEN isin = 'IE00B1FZSB30' THEN 0.33
           WHEN isin = 'IE00B00FV011' THEN 0.15
           WHEN isin = 'IE00B5L65R35' THEN 0.15
           WHEN isin = 'CASH_GBP' THEN 0.02
           END            AS weightage,
       instruments.id     AS instrument_id,
       connect_portfolio_summary.id AS transact_model_portfolio_id,
       'COLOSSUS SETUP SCRIPT'           AS created_by,
       NOW()                             AS created_at,
       'COLOSSUS SETUP SCRIPT'           AS updated_by,
       NOW()                             AS updated_at
FROM instruments
         CROSS JOIN connect_portfolio_summary
WHERE isin IN ('IE00B4WXJK79', 'IE00B1FZSB30', 'IE00B00FV011', 'IE00B5L65R35', 'CASH_GBP')
  AND connect_portfolio_summary."key" = 'CONSERVATIVE'
  AND connect_portfolio_summary.id NOT IN
      (SELECT transact_model_portfolio_id FROM transact_model_portfolio_instruments);

-- CONSERVATIVE Model Portfolio Setup - End

-- GROWTH Model Portfolio Setup - Start

INSERT INTO transact_model_portfolios
(id,
 name,
 description,
 expected_annual_return,
 expected_annual_volatility,
 rebalancing_threshold,
 fact_sheet_url,
 partner_model_id,
 connect_portfolio_summary_id,
 created_by,
 created_at,
 updated_by,
 updated_at)
SELECT id,
       name,
       description,
       expected_return_percent / 100     AS expected_annual_return,
       expected_volatility_percent / 100 AS expected_annual_volatility,
       0.1                               AS rebalancing_threshold,
       NULL                              as fact_sheet_url,
       'mdl-36h4zk4q6242wa'              AS partner_model_id,
       id                                AS connect_portfolio_summary_id,
       'COLOSSUS SETUP SCRIPT'           AS created_by,
       NOW()                             AS created_at,
       'COLOSSUS SETUP SCRIPT'           AS updated_by,
       NOW()                             AS updated_at
FROM connect_portfolio_summary
WHERE "key" = 'GROWTH'
  AND id NOT IN (SELECT connect_portfolio_summary_id FROM transact_model_portfolios);

INSERT INTO transact_model_portfolio_instruments
SELECT uuid_generate_v4() AS id,
       CASE
           WHEN isin = 'IE00B4L5Y983' THEN 0.5
           WHEN isin = 'IE0005042456' THEN 0.25
           WHEN isin = 'IE00B00FV011' THEN 0.14
           WHEN isin = 'IE00B4WXJK79' THEN 0.09
           WHEN isin = 'CASH_GBP' THEN 0.02
           END            AS weightage,
       instruments.id     AS instrument_id,
       connect_portfolio_summary.id AS transact_model_portfolio_id,
       'COLOSSUS SETUP SCRIPT'           AS created_by,
       NOW()                             AS created_at,
       'COLOSSUS SETUP SCRIPT'           AS updated_by,
       NOW()                             AS updated_at
FROM instruments
         CROSS JOIN connect_portfolio_summary
WHERE isin IN ('IE00B4L5Y983', 'IE0005042456', 'IE00B00FV011', 'IE00B4WXJK79', 'CASH_GBP')
  AND connect_portfolio_summary."key" = 'GROWTH'
  AND connect_portfolio_summary.id NOT IN
      (SELECT transact_model_portfolio_id FROM transact_model_portfolio_instruments);

-- GROWTH Model Portfolio Setup - End

-- MODERATE Model Portfolio Setup - Start

INSERT INTO transact_model_portfolios
(id,
 name,
 description,
 expected_annual_return,
 expected_annual_volatility,
 rebalancing_threshold,
 fact_sheet_url,
 partner_model_id,
 connect_portfolio_summary_id,
 created_by,
 created_at,
 updated_by,
 updated_at)
SELECT id,
       name,
       description,
       expected_return_percent / 100     AS expected_annual_return,
       expected_volatility_percent / 100 AS expected_annual_volatility,
       0.1                               AS rebalancing_threshold,
       NULL                              as fact_sheet_url,
       'mdl-36h4zk4q6242wa'              AS partner_model_id,
       id                                AS connect_portfolio_summary_id,
       'COLOSSUS SETUP SCRIPT'           AS created_by,
       NOW()                             AS created_at,
       'COLOSSUS SETUP SCRIPT'           AS updated_by,
       NOW()                             AS updated_at
FROM connect_portfolio_summary
WHERE "key" = 'MODERATE'
  AND id NOT IN (SELECT connect_portfolio_summary_id FROM transact_model_portfolios);

INSERT INTO transact_model_portfolio_instruments
SELECT uuid_generate_v4() AS id,
       CASE
           WHEN isin = 'IE00B4WXJK79' THEN 0.48
           WHEN isin = 'IE00B00FV011' THEN 0.25
           WHEN isin = 'IE00B4L5Y983' THEN 0.175
           WHEN isin = 'IE0005042456' THEN 0.075
           WHEN isin = 'CASH_GBP' THEN 0.02
           END            AS weightage,
       instruments.id     AS instrument_id,
       connect_portfolio_summary.id AS transact_model_portfolio_id,
       'COLOSSUS SETUP SCRIPT'           AS created_by,
       NOW()                             AS created_at,
       'COLOSSUS SETUP SCRIPT'           AS updated_by,
       NOW()                             AS updated_at
FROM instruments
         CROSS JOIN connect_portfolio_summary
WHERE isin IN ('IE00B4WXJK79', 'IE00B00FV011', 'IE00B4L5Y983', 'IE0005042456', 'CASH_GBP')
  AND connect_portfolio_summary."key" = 'MODERATE'
  AND connect_portfolio_summary.id NOT IN
      (SELECT transact_model_portfolio_id FROM transact_model_portfolio_instruments);

-- MODERATE Model Portfolio Setup - End
