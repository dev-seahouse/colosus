-- Migration script for Risk Questionnaire

UPDATE 
  questionnaire_answers 
SET 
  sort_key = 5, 
  updated_at = NOW(), 
  updated_by = 'COLOSSUS MIGRATION SCRIPT' 
WHERE
  answer = '>85%';

------------

UPDATE 
  questionnaire_answers 
SET 
  sort_key = 4, 
  updated_at = NOW(), 
  updated_by = 'COLOSSUS MIGRATION SCRIPT' 
WHERE
  answer = '70-85%'; 

---------------


UPDATE 
  questionnaire_answers 
SET 
  sort_key = 3, 
  updated_at = NOW(), 
  updated_by = 'COLOSSUS MIGRATION SCRIPT' 
WHERE
  answer = '50-70%'; 

----------------

UPDATE 
  questionnaire_answers 
SET 
  sort_key = 2, 
  updated_at = NOW(), 
  updated_by = 'COLOSSUS MIGRATION SCRIPT' 
WHERE
  answer = '35-50%'; 

  UPDATE 
  questionnaire_answers 
SET 
  sort_key = 1, 
  updated_at = NOW(), 
  updated_by = 'COLOSSUS MIGRATION SCRIPT' 
WHERE
  answer = '<35%'; 

----------------

-- Updating How familiar are you with investing question answers

UPDATE 
  questionnaire_answers 
SET 
  sort_key = 5, 
  answer = 'I have no idea', 
  updated_at = NOW(), 
  updated_by = 'COLOSSUS MIGRATION SCRIPT' 
WHERE
  answer = 'Not familiar at all'; 

----------

UPDATE 
  questionnaire_answers 
SET 
  sort_key = 4, 
  answer = 'Only mutual funds/or bonds',
  updated_at = NOW(), 
  updated_by = 'COLOSSUS MIGRATION SCRIPT' 
WHERE
  answer = 'Somewhat familiar'; 

--------

UPDATE 
  questionnaire_answers 
SET 
  sort_key = 3, 
  answer = 'Only capital market', 
  updated_at = NOW(), 
  updated_by = 'COLOSSUS MIGRATION SCRIPT' 
WHERE
  answer = 'Moderately familiar'; 

---------------

UPDATE 
  questionnaire_answers 
SET 
  sort_key = 2, 
  answer = 'Quite knowledgeable',
  updated_at = NOW(), 
  updated_by = 'COLOSSUS MIGRATION SCRIPT' 
WHERE
  answer = 'Very familiar'; 

---------------

UPDATE 
  questionnaire_answers 
SET 
  sort_key = 1,
  answer = 'Expert', 
  updated_at = NOW(), 
  updated_by = 'COLOSSUS MIGRATION SCRIPT' 
WHERE
  answer = 'Extremely familiar'; 

----------------

--- Updating Risk Levels Answers

UPDATE 
  questionnaire_answers 
SET 
  sort_key = 4, 
  answer = 'No risk <br/>this portfolio''s value should be slowly but surely going up.',
  updated_at = NOW(), 
  updated_by = 'COLOSSUS MIGRATION SCRIPT' 
WHERE
  answer LIKE 'No risk:%'; 

-----

UPDATE 
  questionnaire_answers 
SET 
  sort_key = 3, 
  answer = 'Limited risk <br/>this portfolio''s value can go down for a short period of time but its value should be going up most of the time.',
  updated_at = NOW(), 
  updated_by = 'COLOSSUS MIGRATION SCRIPT' 
WHERE
  answer LIKE 'Limited risk:%'; 

-----

UPDATE 
  questionnaire_answers 
SET 
  sort_key = 2, 
  answer = 'Significant risk <br/>this portfolio''s value will go down for a certain period of time but it should recover if I am patient enough.',
  updated_at = NOW(), 
  updated_by = 'COLOSSUS MIGRATION SCRIPT' 
WHERE
  answer LIKE 'Significant risk:%'; 

-----

UPDATE 
  questionnaire_answers 
SET 
  sort_key = 1, 
  answer = 'High risk <br/> this portfolio''s value may fluctuate widely but I trust that it will pay off very significantly at one point in the future.',
  updated_at = NOW(), 
  updated_by = 'COLOSSUS MIGRATION SCRIPT' 
WHERE
  answer LIKE 'High risk:%'; 

-----