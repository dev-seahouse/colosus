UPDATE public.questionnaire_answers
SET answer = 'No experience'
WHERE id IN (SELECT public.questionnaire_answers.id
             FROM public.questionnaire_answers
                    INNER JOIN public.questionnaire_questions
                               ON public.questionnaire_answers.risk_profile_question_id =
                                  public.questionnaire_questions.id
             WHERE question_type = 'FINANCIAL_KNOWLEDGE'
               AND answer = 'I have no idea');

UPDATE public.questionnaire_answers
SET answer = 'Some experience'
WHERE id IN (SELECT public.questionnaire_answers.id
             FROM public.questionnaire_answers
                    INNER JOIN public.questionnaire_questions
                               ON public.questionnaire_answers.risk_profile_question_id =
                                  public.questionnaire_questions.id
             WHERE question_type = 'FINANCIAL_KNOWLEDGE'
               AND answer = 'Only mutual funds/or bonds');

UPDATE public.questionnaire_answers
SET answer = 'Average experience'
WHERE id IN (SELECT public.questionnaire_answers.id
             FROM public.questionnaire_answers
                    INNER JOIN public.questionnaire_questions
                               ON public.questionnaire_answers.risk_profile_question_id =
                                  public.questionnaire_questions.id
             WHERE question_type = 'FINANCIAL_KNOWLEDGE'
               AND answer = 'Only capital market');

UPDATE public.questionnaire_answers
SET answer = 'High experience'
WHERE id IN (SELECT public.questionnaire_answers.id
             FROM public.questionnaire_answers
                    INNER JOIN public.questionnaire_questions
                               ON public.questionnaire_answers.risk_profile_question_id =
                                  public.questionnaire_questions.id
             WHERE question_type = 'FINANCIAL_KNOWLEDGE'
               AND answer = 'Quite knowledgeable');

UPDATE risk_profiles
SET risk_profile_description = 'You don’t want to experience volatility in your portfolio.<br/>You don’t expect the value of your portfolio to go down at any significant period of time.<br/>You understand that expected returns are low.'
WHERE id IN (SELECT id
             FROM risk_profiles
             WHERE risk_profile_name = 'Very Conservative');
