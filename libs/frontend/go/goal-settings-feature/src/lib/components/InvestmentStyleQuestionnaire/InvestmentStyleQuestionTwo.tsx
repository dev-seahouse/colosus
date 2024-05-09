import { Form, Typography, Stack } from '@bambu/react-ui';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import InvestmentStyleListControl from './components/InvestmentStyleListControl';
import { InvestmentStyleQuestionaireBottomAction } from './components/InvestmentStyleQuestionaireBottomAction';
import { makeValidationSchema } from './utils/makeValidationSchema';
import { defaultTransformAnswers as transformAnswers } from './utils/defaultTransformAnswers';
import IKnowMyRiskProfileAction from './components/IKnowMyRiskProfileAction';
import {
  useSelectInvestorQuestionnaireGroupByKey,
  useSelectSetHasSelectedRiskQuestionnaire,
  useSelectUpdateRiskQuestionnaire,
} from '@bambu/go-core';
import { useEffect } from 'react';

const investmentStyleFormSchema = makeValidationSchema({
  name: 'questionTwo',
});
export type InvestmentStyleQuestionTwoFormState = z.infer<
  typeof investmentStyleFormSchema
>;

// TODO: think of a better name for questionOne, questionTwo etc because they are not actually first question
// TODO: set default values
export function InvestmentStyleQuestionTwo() {
  const setRiskQuestionnaireSelection =
    useSelectSetHasSelectedRiskQuestionnaire();
  const updateRiskQuestionnaire = useSelectUpdateRiskQuestionnaire();
  const navigate = useNavigate();

  useEffect(() => {
    setRiskQuestionnaireSelection(true);
  }, [setRiskQuestionnaireSelection]);

  const {
    isLoading,
    isSuccess,
    data: questionnaireGroup,
  } = useSelectInvestorQuestionnaireGroupByKey({ key: 'RISK_COMFORT_LEVEL' });

  const { control, handleSubmit } =
    useForm<InvestmentStyleQuestionTwoFormState>({
      resolver: zodResolver(investmentStyleFormSchema),
      defaultValues: {},
    });

  if (isLoading || !isSuccess || !questionnaireGroup) {
    return null;
  }

  const {
    question,
    Answers: questionnaireAnswers,
    id,
  } = questionnaireGroup.Questions[1];

  const onSubmit = handleSubmit(({ questionTwo }) => {
    updateRiskQuestionnaire({
      questionnaireGroup,
      questionId: id,
      answerId: questionTwo,
      answerScoreNumber: null,
    });
    navigate('../investment-style-question-three');
  });

  return (
    <Form onSubmit={onSubmit}>
      <Stack spacing={2} sx={{ pb: '6rem' }}>
        <Stack spacing={2}>
          <Typography variant="h1" textAlign="center" mobiletextalign="left">
            {question}
          </Typography>

          <InvestmentStyleListControl
            questionnaireAnswers={transformAnswers(questionnaireAnswers)}
            name="questionTwo"
            control={control}
          />
          <IKnowMyRiskProfileAction />
        </Stack>
        <InvestmentStyleQuestionaireBottomAction />
      </Stack>
    </Form>
  );
}

export default InvestmentStyleQuestionTwo;
