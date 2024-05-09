import { Form, Typography, Stack } from '@bambu/react-ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InvestmentStyleListControl from './components/InvestmentStyleListControl';
import { InvestmentStyleQuestionaireBottomAction } from './components/InvestmentStyleQuestionaireBottomAction';
import type { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { makeValidationSchema } from './utils/makeValidationSchema';
import { defaultTransformAnswers as transformAnswers } from './utils/defaultTransformAnswers';
import {
  useSelectInvestorQuestionnaireGroupByKey,
  useSelectSetHasSelectedRiskQuestionnaire,
  useSelectUpdateRiskQuestionnaire,
} from '@bambu/go-core';
import { useEffect } from 'react';

const investmentStyleFormSchema = makeValidationSchema({
  name: 'questionThree',
});

export type InvestmentStyleQuestionThreeFormState = z.infer<
  typeof investmentStyleFormSchema
>;

// TODO: think of a better name for questionOne, questionTwo etc because they are not actually first question
// TODO: set default values
export function InvestmentStyleQuestionThree() {
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
  } = useSelectInvestorQuestionnaireGroupByKey({ key: 'FINANCIAL_KNOWLEDGE' });

  const { control, handleSubmit } =
    useForm<InvestmentStyleQuestionThreeFormState>({
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
  } = questionnaireGroup.Questions[0];

  const onSubmit = handleSubmit(({ questionThree }) => {
    updateRiskQuestionnaire({
      questionnaireGroup,
      questionId: id,
      answerId: questionThree,
      answerScoreNumber: null,
    });
    navigate('../investment-style-question-four');
  });
  return (
    <Form onSubmit={onSubmit}>
      <Stack spacing={10} sx={{ pb: '6rem' }}>
        <Stack spacing={3}>
          <Typography variant="h1" textAlign="center" mobiletextalign="left">
            {question}
          </Typography>
          {/** Will need to speak to design about the error toast notification as other forms are displaying the error at the bottom for the form. For consistency. */}
          <InvestmentStyleListControl
            questionnaireAnswers={transformAnswers(questionnaireAnswers)}
            name="questionThree"
            control={control}
          />
        </Stack>
      </Stack>
      <InvestmentStyleQuestionaireBottomAction />
    </Form>
  );
}

export default InvestmentStyleQuestionThree;
