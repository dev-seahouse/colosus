UPDATE 
  risk_profiles 
SET 
  risk_profile_name = 'Very Conservative', 
  risk_profile_description = 'You don''t want to experience volatility in your portfolio.<br/>You don''t expect the value of your portfolio to go down at any significant period of time.<br/>You understand that expected returns are low', 
  updated_at = NOW(), 
  updated_by = 'COLOSSUS MIGRATION SCRIPT' 
WHERE 
  lower_limit = 1 
  AND upper_limit = 1;
  
-----
UPDATE 
  risk_profiles 
SET 
  risk_profile_name = 'Conservative', 
  risk_profile_description = 'You are OK with a bit of volatility in your portfolio.<br/>You understand that the value of your portfolio may go down for a short period of time before it bounces back.<br/>You understand that expected returns are below average.', 
  updated_at = NOW(), 
  updated_by = 'COLOSSUS MIGRATION SCRIPT' 
WHERE 
  lower_limit = 2 
  AND upper_limit = 2;

----
UPDATE 
  risk_profiles 
SET 
  risk_profile_name = 'Balanced', 
  risk_profile_description = 'You are OK with some volatility in your portfolio.<br/>You understand that the value of your portfolio may go down for a moderate period of time before it bounces back.<br/>You understand that expected returns are average.', 
  updated_at = NOW(), 
  updated_by = 'COLOSSUS MIGRATION SCRIPT' 
WHERE 
  lower_limit = 3 
  AND upper_limit = 3;

-----
UPDATE 
  risk_profiles 
SET 
  risk_profile_name = 'Growth', 
  risk_profile_description = 'You are OK with volatility in your portfolio.<br/>You understand that the value of your portfolio may go down for a significant period of time before it bounces back.<br/>You expect good returns in the mid to long term.', 
  updated_at = NOW(), 
  updated_by = 'COLOSSUS MIGRATION SCRIPT' 
WHERE 
  lower_limit = 4 
  AND upper_limit = 4;

----
UPDATE 
  risk_profiles

  SET risk_profile_name = 'Growth',
      risk_profile_description = 'You are OK with high volatility in your portfolio.<br/>You understand that the value of your portfolio may go down sharply in the future but you know that you will reap big benefits if you are patient enough.<br/>You expect high returns in the long term.',
      updated_at = NOW(),
      updated_by = 'COLOSSUS MIGRATION SCRIPT'
  WHERE lower_limit = 5 AND upper_limit = 5;