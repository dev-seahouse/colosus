-- Migration Script


UPDATE 
  questionnaire_questions
SET 
  sort_key = 2, 
  updated_at = NOW(), 
  updated_by = 'COLOSSUS MIGRATION SCRIPT' 
WHERE
  question = 'Imagine you witness a sudden drop in the value of this portfolio due to market fluctuations. What will you do?';

----


UPDATE 
  risk_profiles

  SET risk_profile_name = 'Aggressive',
      updated_at = NOW(),
      updated_by = 'COLOSSUS MIGRATION SCRIPT'
  WHERE lower_limit = 5 AND upper_limit = 5;

----



