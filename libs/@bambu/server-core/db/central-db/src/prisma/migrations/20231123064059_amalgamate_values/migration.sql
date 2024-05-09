DO
$$
  DECLARE
    rec           RECORD;
    new_elements  JSONB;
    element       JSONB;
    bond_value    INTEGER;
    cash_value    INTEGER;
  BEGIN
    FOR rec IN SELECT id, asset_class_allocation FROM connect_portfolio_summary
      LOOP
        -- Initialize variables
        bond_value := 0;
        cash_value := 0;
        new_elements := '[]'::JSONB;

        -- First, calculate the total bond and cash values
        FOR element IN SELECT * FROM jsonb_array_elements(rec.asset_class_allocation)
          LOOP
            IF element ->> 'assetClass' = 'Bonds' THEN
              bond_value := (element ->> 'percentOfPortfolio')::INTEGER;
            ELSIF element ->> 'assetClass' = 'Cash' THEN
              cash_value := (element ->> 'percentOfPortfolio')::INTEGER;
            END IF;
          END LOOP;

        -- Then, construct the updated JSON array while preserving order
        FOR element IN SELECT * FROM jsonb_array_elements(rec.asset_class_allocation)
          LOOP
            IF element ->> 'assetClass' = 'Bonds' THEN
              -- Update the bond value with the sum of bonds and cash
              element := jsonb_set(element, '{percentOfPortfolio}', to_jsonb((bond_value + cash_value)::text));
            ELSIF element ->> 'assetClass' = 'Cash' THEN
              -- Set the cash value to 0
              element := jsonb_set(element, '{percentOfPortfolio}', to_jsonb('0'::text));
            END IF;
            -- Add the (possibly modified) element to the new array
            new_elements := new_elements || element;
          END LOOP;

        -- Update the table with the new JSONB array
        UPDATE connect_portfolio_summary
        SET asset_class_allocation = new_elements
        WHERE id = rec.id;
      END LOOP;
  END
$$;
