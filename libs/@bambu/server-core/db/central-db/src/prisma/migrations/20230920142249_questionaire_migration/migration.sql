-- Enable UUID extension for PGSQL
CREATE
  EXTENSION IF NOT EXISTS "uuid-ossp";

DO
$$
  DECLARE
    questionnaire_groupings_data JSONB := '[
      {
        "groupingType": "RISK_CAPACITY",
        "groupingName": "FINANCIAL_HEALTH",
        "groupingWeight": "0.4",
        "scoringRules": "MAX",
        "sortKey": 1,
        "additionalConfiguration": {
          "questionRoundFlag": true
        },
        "Questions": [
          {
            "question": "How much do you roughly save out of your monthly income?",
            "questionType": "INCOME",
            "questionFormat": "NUMERIC_ENTRY",
            "questionWeight": "0.5",
            "sortKey": 1,
            "additionalConfiguration": {
              "scoreRangeConfig": [
                {
                  "label": "<10%",
                  "score": 1,
                  "lowerBound": 0,
                  "upperBound": 9
                },
                {
                  "score": 2,
                  "answer": "10-25%",
                  "lowerBound": 10,
                  "upperBound": 24
                },
                {
                  "score": 3,
                  "answer": "25-35%",
                  "lowerBound": 25,
                  "upperBound": 34
                },
                {
                  "score": 4,
                  "answer": "35-50%",
                  "lowerBound": 35,
                  "upperBound": 49
                },
                {
                  "score": 5,
                  "answer": ">50%",
                  "lowerBound": 50,
                  "upperBound": 100
                }
              ],
              "questionFloorFlag": true,
              "questionNormalisationFactor1": "1",
              "questionNormalisationFactor2": "5"
            },
            "Answers": []
          },
          {
            "question": "How much of your liquid assets are you planning to invest here?",
            "questionType": "BALANCE_SHEET",
            "questionFormat": "SINGLE_CHOICE",
            "questionWeight": "0.5",
            "sortKey": 2,
            "additionalConfiguration": {
              "questionFloorFlag": true,
              "questionNormalisationFactor1": "1",
              "questionNormalisationFactor2": "5"
            },
            "Answers": [
              {
                "answer": ">85%",
                "sortKey": 1,
                "score": "1",
                "additionalConfiguration": {}
              },
              {
                "answer": "<35%",
                "sortKey": 5,
                "score": "5",
                "additionalConfiguration": {}
              },
              {
                "answer": "70-85%",
                "sortKey": 2,
                "score": "2",
                "additionalConfiguration": {}
              },
              {
                "answer": "50-70%",
                "sortKey": 3,
                "score": "3",
                "additionalConfiguration": {}
              },
              {
                "answer": "35-50%",
                "sortKey": 4,
                "score": "4",
                "additionalConfiguration": {}
              }
            ]
          }
        ]
      },
      {
        "groupingType": "RISK_CAPACITY",
        "groupingName": "GOAL",
        "groupingWeight": "0.2",
        "scoringRules": "MAX",
        "sortKey": 2,
        "additionalConfiguration": {
          "questionRoundDownFlag": true,
          "questionNormalisationFactor1": "1",
          "questionNormalisationFactor2": "12"
        },
        "Questions": [
          {
            "question": "When do you want to achieve your goal?",
            "questionType": "GOAL_TIME_FRAME",
            "questionFormat": "NUMERIC_ENTRY",
            "questionWeight": "0",
            "sortKey": 1,
            "additionalConfiguration": {},
            "Answers": []
          }
        ]
      },
      {
        "groupingType": "RISK_CAPACITY",
        "groupingName": "AGE",
        "groupingWeight": "0.2",
        "scoringRules": "MAX",
        "sortKey": 3,
        "additionalConfiguration": {
          "questionRoundUpFlag": true,
          "questionNormalisationFactor1": "70",
          "questionNormalisationFactor2": "18"
        },
        "Questions": [
          {
            "question": "How old are you?",
            "questionType": "AGE",
            "questionFormat": "NUMERIC_ENTRY",
            "questionWeight": "0",
            "sortKey": 1,
            "additionalConfiguration": {},
            "Answers": []
          }
        ]
      },
      {
        "groupingType": "RISK_CAPACITY",
        "groupingName": "FINANCIAL_KNOWLEDGE",
        "groupingWeight": "0.2",
        "scoringRules": "MAX",
        "sortKey": 4,
        "additionalConfiguration": {
          "questionNormalisationFactor1": "1",
          "questionNormalisationFactor2": "5"
        },
        "Questions": [
          {
            "question": "How familiar are you with investing?",
            "questionType": "FINANCIAL_KNOWLEDGE",
            "questionFormat": "SINGLE_CHOICE",
            "questionWeight": "0",
            "sortKey": 1,
            "additionalConfiguration": {},
            "Answers": [
              {
                "answer": "Not familiar at all",
                "sortKey": 1,
                "score": "1",
                "additionalConfiguration": {}
              },
              {
                "answer": "Moderately familiar",
                "sortKey": 3,
                "score": "3",
                "additionalConfiguration": {}
              },
              {
                "answer": "Somewhat familiar",
                "sortKey": 2,
                "score": "2",
                "additionalConfiguration": {}
              },
              {
                "answer": "Very familiar",
                "sortKey": 4,
                "score": "4",
                "additionalConfiguration": {}
              },
              {
                "answer": "Extremely familiar",
                "sortKey": 5,
                "score": "5",
                "additionalConfiguration": {}
              }
            ]
          }
        ]
      },
      {
        "groupingType": "RISK_TOLERANCE",
        "groupingName": "RISK_COMFORT_LEVEL",
        "groupingWeight": "0.5",
        "scoringRules": "MAX",
        "sortKey": 1,
        "additionalConfiguration": {
          "questionCapFlag": true,
          "questionRoundDownFlag": true
        },
        "Questions": [
          {
            "question": "What level of risk are you comfortable with for this portfolio?",
            "questionType": "RISK_COMFORT_LEVEL",
            "questionFormat": "SINGLE_CHOICE",
            "questionWeight": "0.5",
            "sortKey": 1,
            "additionalConfiguration": {
              "questionNormalisationFactor1": "1",
              "questionNormalisationFactor2": "4"
            },
            "Answers": [
              {
                "answer": "Limited risk: this portfolio''s value can go down for a short period of time but its value should be going up most of the time.",
                "sortKey": 2,
                "score": "2",
                "additionalConfiguration": {}
              },
              {
                "answer": "No risk: this portfolio''s value should be slowly but surely going up.",
                "sortKey": 1,
                "score": "1",
                "additionalConfiguration": {}
              },
              {
                "answer": "Significant risk: this portfolio''s value will go down for a certain period of time but it should recover if I am patient enough.",
                "sortKey": 3,
                "score": "3",
                "additionalConfiguration": {}
              },
              {
                "answer": "High risk: this portfolio''s value may fluctuate widely but I trust that it will pay off very significantly at one point in the future.",
                "sortKey": 4,
                "score": "4",
                "additionalConfiguration": {}
              }
            ]
          },
          {
            "question": "Imagine you witness a sudden drop in the value of this portfolio due to market fluctuations. What will you do?",
            "questionType": "RISK_COMFORT_LEVEL",
            "questionFormat": "SINGLE_CHOICE",
            "questionWeight": "0.5",
            "sortKey": 1,
            "additionalConfiguration": {
              "questionNormalisationFactor1": "1",
              "questionNormalisationFactor2": "4"
            },
            "Answers": [
              {
                "answer": "I will sell a part of this portfolio to minimise exposure, but keep some in hope that prices bounce back.",
                "sortKey": 2,
                "score": "2",
                "additionalConfiguration": {}
              },
              {
                "answer": "I will invest more into this portfolio since its price is likely to bounce back.",
                "sortKey": 4,
                "score": "4",
                "additionalConfiguration": {}
              },
              {
                "answer": "I will continue holding onto my portfolio and hope it returns to the original price.",
                "sortKey": 3,
                "score": "3",
                "additionalConfiguration": {}
              },
              {
                "answer": "I will fully redeem this portfolio to avoid further losses.",
                "sortKey": 1,
                "score": "1",
                "additionalConfiguration": {}
              }
            ]
          }
        ]
      }
    ]'::jsonb;
    questionnaire_grouping       JSONB;
    questions                    JSONB;
    question                     JSONB;
    answers JSONB;
    answer JSONB;
  BEGIN
    FOR questionnaire_grouping IN
      SELECT *
      FROM jsonb_array_elements(questionnaire_groupings_data)
      LOOP
        -- Print the JSONB object to the console
        RAISE NOTICE 'questionnaire_grouping: %', questionnaire_grouping;

        questions := questionnaire_grouping -> 'Questions';

        IF questions IS NOT NULL THEN
          FOR question IN
            SELECT *
            FROM jsonb_array_elements(questions)
            LOOP
              -- Print the question information
              RAISE NOTICE 'Question: %', question ->> 'question';
              RAISE NOTICE 'Question Type: %', question ->> 'questionType';
              RAISE NOTICE 'Question Format: %', question ->> 'questionFormat';


              answers := question->'Answers';
              IF answers IS NOT NULL THEN
                FOR answer IN
                  SELECT *
                  FROM jsonb_array_elements(answers)
                  LOOP
                    RAISE NOTICE 'answers: %', answer;
                  END LOOP;
              END IF;
            END LOOP;
        END IF;
      END LOOP;
  END;
$$;

DO
$$
  DECLARE
    tenant_row                   RECORD;
    questionnaire_groupings_data JSONB := '[
      {
        "groupingType": "RISK_CAPACITY",
        "groupingName": "FINANCIAL_HEALTH",
        "groupingWeight": "0.4",
        "scoringRules": "MAX",
        "sortKey": 1,
        "additionalConfiguration": {
          "questionRoundFlag": true
        },
        "Questions": [
          {
            "question": "How much do you roughly save out of your monthly income?",
            "questionType": "INCOME",
            "questionFormat": "NUMERIC_ENTRY",
            "questionWeight": "0.5",
            "sortKey": 1,
            "additionalConfiguration": {
              "scoreRangeConfig": [
                {
                  "label": "<10%",
                  "score": 1,
                  "lowerBound": 0,
                  "upperBound": 9
                },
                {
                  "score": 2,
                  "answer": "10-25%",
                  "lowerBound": 10,
                  "upperBound": 24
                },
                {
                  "score": 3,
                  "answer": "25-35%",
                  "lowerBound": 25,
                  "upperBound": 34
                },
                {
                  "score": 4,
                  "answer": "35-50%",
                  "lowerBound": 35,
                  "upperBound": 49
                },
                {
                  "score": 5,
                  "answer": ">50%",
                  "lowerBound": 50,
                  "upperBound": 100
                }
              ],
              "questionFloorFlag": true,
              "questionNormalisationFactor1": "1",
              "questionNormalisationFactor2": "5"
            },
            "Answers": []
          },
          {
            "question": "How much of your liquid assets are you planning to invest here?",
            "questionType": "BALANCE_SHEET",
            "questionFormat": "SINGLE_CHOICE",
            "questionWeight": "0.5",
            "sortKey": 2,
            "additionalConfiguration": {
              "questionFloorFlag": true,
              "questionNormalisationFactor1": "1",
              "questionNormalisationFactor2": "5"
            },
            "Answers": [
              {
                "answer": ">85%",
                "sortKey": 1,
                "score": "1",
                "additionalConfiguration": {}
              },
              {
                "answer": "<35%",
                "sortKey": 5,
                "score": "5",
                "additionalConfiguration": {}
              },
              {
                "answer": "70-85%",
                "sortKey": 2,
                "score": "2",
                "additionalConfiguration": {}
              },
              {
                "answer": "50-70%",
                "sortKey": 3,
                "score": "3",
                "additionalConfiguration": {}
              },
              {
                "answer": "35-50%",
                "sortKey": 4,
                "score": "4",
                "additionalConfiguration": {}
              }
            ]
          }
        ]
      },
      {
        "groupingType": "RISK_CAPACITY",
        "groupingName": "GOAL",
        "groupingWeight": "0.2",
        "scoringRules": "MAX",
        "sortKey": 2,
        "additionalConfiguration": {
          "questionRoundDownFlag": true,
          "questionNormalisationFactor1": "1",
          "questionNormalisationFactor2": "12"
        },
        "Questions": [
          {
            "question": "When do you want to achieve your goal?",
            "questionType": "GOAL_TIME_FRAME",
            "questionFormat": "NUMERIC_ENTRY",
            "questionWeight": "0",
            "sortKey": 1,
            "additionalConfiguration": {},
            "Answers": []
          }
        ]
      },
      {
        "groupingType": "RISK_CAPACITY",
        "groupingName": "AGE",
        "groupingWeight": "0.2",
        "scoringRules": "MAX",
        "sortKey": 3,
        "additionalConfiguration": {
          "questionRoundUpFlag": true,
          "questionNormalisationFactor1": "70",
          "questionNormalisationFactor2": "18"
        },
        "Questions": [
          {
            "question": "How old are you?",
            "questionType": "AGE",
            "questionFormat": "NUMERIC_ENTRY",
            "questionWeight": "0",
            "sortKey": 1,
            "additionalConfiguration": {},
            "Answers": []
          }
        ]
      },
      {
        "groupingType": "RISK_CAPACITY",
        "groupingName": "FINANCIAL_KNOWLEDGE",
        "groupingWeight": "0.2",
        "scoringRules": "MAX",
        "sortKey": 4,
        "additionalConfiguration": {
          "questionNormalisationFactor1": "1",
          "questionNormalisationFactor2": "5"
        },
        "Questions": [
          {
            "question": "How familiar are you with investing?",
            "questionType": "FINANCIAL_KNOWLEDGE",
            "questionFormat": "SINGLE_CHOICE",
            "questionWeight": "0",
            "sortKey": 1,
            "additionalConfiguration": {},
            "Answers": [
              {
                "answer": "Not familiar at all",
                "sortKey": 1,
                "score": "1",
                "additionalConfiguration": {}
              },
              {
                "answer": "Moderately familiar",
                "sortKey": 3,
                "score": "3",
                "additionalConfiguration": {}
              },
              {
                "answer": "Somewhat familiar",
                "sortKey": 2,
                "score": "2",
                "additionalConfiguration": {}
              },
              {
                "answer": "Very familiar",
                "sortKey": 4,
                "score": "4",
                "additionalConfiguration": {}
              },
              {
                "answer": "Extremely familiar",
                "sortKey": 5,
                "score": "5",
                "additionalConfiguration": {}
              }
            ]
          }
        ]
      },
      {
        "groupingType": "RISK_TOLERANCE",
        "groupingName": "RISK_COMFORT_LEVEL",
        "groupingWeight": "0.5",
        "scoringRules": "MAX",
        "sortKey": 1,
        "additionalConfiguration": {
          "questionCapFlag": true,
          "questionRoundDownFlag": true
        },
        "Questions": [
          {
            "question": "What level of risk are you comfortable with for this portfolio?",
            "questionType": "RISK_COMFORT_LEVEL",
            "questionFormat": "SINGLE_CHOICE",
            "questionWeight": "0.5",
            "sortKey": 1,
            "additionalConfiguration": {
              "questionNormalisationFactor1": "1",
              "questionNormalisationFactor2": "4"
            },
            "Answers": [
              {
                "answer": "Limited risk: this portfolio''s value can go down for a short period of time but its value should be going up most of the time.",
                "sortKey": 2,
                "score": "2",
                "additionalConfiguration": {}
              },
              {
                "answer": "No risk: this portfolio''s value should be slowly but surely going up.",
                "sortKey": 1,
                "score": "1",
                "additionalConfiguration": {}
              },
              {
                "answer": "Significant risk: this portfolio''s value will go down for a certain period of time but it should recover if I am patient enough.",
                "sortKey": 3,
                "score": "3",
                "additionalConfiguration": {}
              },
              {
                "answer": "High risk: this portfolio''s value may fluctuate widely but I trust that it will pay off very significantly at one point in the future.",
                "sortKey": 4,
                "score": "4",
                "additionalConfiguration": {}
              }
            ]
          },
          {
            "question": "Imagine you witness a sudden drop in the value of this portfolio due to market fluctuations. What will you do?",
            "questionType": "RISK_COMFORT_LEVEL",
            "questionFormat": "SINGLE_CHOICE",
            "questionWeight": "0.5",
            "sortKey": 1,
            "additionalConfiguration": {
              "questionNormalisationFactor1": "1",
              "questionNormalisationFactor2": "4"
            },
            "Answers": [
              {
                "answer": "I will sell a part of this portfolio to minimise exposure, but keep some in hope that prices bounce back.",
                "sortKey": 2,
                "score": "2",
                "additionalConfiguration": {}
              },
              {
                "answer": "I will invest more into this portfolio since its price is likely to bounce back.",
                "sortKey": 4,
                "score": "4",
                "additionalConfiguration": {}
              },
              {
                "answer": "I will continue holding onto my portfolio and hope it returns to the original price.",
                "sortKey": 3,
                "score": "3",
                "additionalConfiguration": {}
              },
              {
                "answer": "I will fully redeem this portfolio to avoid further losses.",
                "sortKey": 1,
                "score": "1",
                "additionalConfiguration": {}
              }
            ]
          }
        ]
      }
    ]'::jsonb;
    questionnaire_grouping       JSONB;
    questions                    JSONB;
    question                     JSONB;
    answer                       JSONB;
    answers                      JSONB;
    questionnaire_id             uuid;
    questionnaire_version_id     uuid;
    grouping_id                  uuid;
    question_id                  uuid;
    answer_id                    uuid;

  BEGIN
    FOR tenant_row IN (SELECT *
                       FROM tenants
                       WHERE id NOT IN (SELECT DISTINCT questionnaires.tenant_id FROM questionnaires))
      LOOP
        INSERT
        INTO questionnaires(id,
                            questionnaire_type,
                            questionnaire_name,
                            questionnaire_description,
                            active_version,
                            tenant_id,
                            created_by,
                            created_at,
                            updated_by,
                            updated_at)
        VALUES (uuid_generate_v4(),
                'RISK_PROFILING',
                'Initial Questionnaire',
                'Initial Questionnaire',
                1,
                tenant_row.id,
                'COLOSSUS MIGRATION SCRIPT',
                NOW(),
                'COLOSSUS MIGRATION SCRIPT',
                NOW())
        RETURNING id into questionnaire_id;

        INSERT INTO questionnaire_versions(id,
                                           version_number,
                                           version_description,
                                           version_notes,
                                           created_by,
                                           created_at,
                                           updated_by,
                                           updated_at,
                                           questionnaire_id)
        VALUES (uuid_generate_v4(),
                1,
                'Intial Version',
                'Initial Version',
                'COLOSSUS MIGRATION SCRIPT',
                NOW(),
                'COLOSSUS MIGRATION SCRIPT',
                NOW(),
                questionnaire_id)
        RETURNING id INTO questionnaire_version_id;

        FOR questionnaire_grouping IN
          SELECT *
          FROM jsonb_array_elements(questionnaire_groupings_data)
          LOOP
            INSERT
            INTO questionnaire_groupings (id,
                                          grouping_type,
                                          grouping_name,
                                          scoring_rules,
                                          sort_key,
                                          additional_configuration,
                                          grouping_weight,
                                          questionnaire_version_id,
                                          created_by,
                                          created_at,
                                          updated_by,
                                          updated_at)
            VALUES (uuid_generate_v4(),
                    questionnaire_grouping ->> 'groupingType',
                    questionnaire_grouping ->> 'groupingName',
                    questionnaire_grouping ->> 'scoringRules',
                    (questionnaire_grouping ->> 'sortKey')::INTEGER,
                    (questionnaire_grouping ->> 'additionalConfiguration')::jsonb,
                    (questionnaire_grouping ->> 'groupingWeight')::NUMERIC,
                    questionnaire_version_id,
                    'COLOSSUS MIGRATION SCRIPT',
                    NOW(),
                    'COLOSSUS MIGRATION SCRIPT',
                    NOW())
            RETURNING id INTO grouping_id;

            questions := questionnaire_grouping -> 'Questions';

            IF questions IS NOT NULL THEN
              FOR question IN
                SELECT *
                FROM jsonb_array_elements(questions)
                LOOP
                  INSERT
                  INTO questionnaire_questions (id,
                                                question,
                                                question_type,
                                                question_format,
                                                question_weight,
                                                sort_key,
                                                additional_configuration,
                                                questionnaire_question_groupings_id,
                                                created_by,
                                                created_at,
                                                updated_by,
                                                updated_at)
                  VALUES (uuid_generate_v4(),
                          question ->> 'question',
                          question ->> 'questionType',
                          question ->> 'questionFormat',
                          (question ->> 'questionWeight')::NUMERIC,
                          (question ->> 'sortKey')::INT,
                          (question ->> 'additionalConfiguration')::JSONB,
                          grouping_id,
                          'COLOSSUS MIGRATION SCRIPT',
                          NOW(),
                          'COLOSSUS MIGRATION SCRIPT',
                          NOW())
                  RETURNING id INTO question_id;

                  answers := question->'Answers';
                  IF answers IS NOT NULL THEN
                    FOR answer IN
                      SELECT *
                      FROM jsonb_array_elements(answers)
                      LOOP
                        RAISE NOTICE 'Current answer %', answer;
                        IF answer->>'answer' IS NULL THEN
                          RAISE  EXCEPTION 'The answer field is NULL in the following object: %', answer;
                        END IF;
                        INSERT
                        INTO questionnaire_answers (id,
                                                    answer,
                                                    score,
                                                    sort_key,
                                                    additional_configuration,
                                                    risk_profile_question_id,
                                                    created_by,
                                                    created_at,
                                                    updated_by,
                                                    updated_at)
                        VALUES (uuid_generate_v4(),
                                (answer->>'answer'),
                                (answer->>'score')::NUMERIC,
                                (answer->>'sortKey')::INTEGER,
                                (answer->>'additionalConfiguration')::JSONB,
                                question_id,
                                'COLOSSUS MIGRATION SCRIPT',
                                NOW(),
                                'COLOSSUS MIGRATION SCRIPT',
                                NOW());
                      END LOOP;
                  END IF;
                END LOOP;
            END IF;
          END LOOP;
      END LOOP;
  EXCEPTION
    WHEN others THEN
      RAISE EXCEPTION 'An error occurred while migrating risk Questionnaire of existing users: %', SQLERRM;
  END
$$;
