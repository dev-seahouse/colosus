import { capitalize, Form, Stack, Typography } from '@bambu/react-ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InvestmentStyleListControl from './components/InvestmentStyleListControl';
import { InvestmentStyleQuestionaireBottomAction } from './components/InvestmentStyleQuestionaireBottomAction';
import { makeValidationSchema } from './utils/makeValidationSchema';
import type { z } from 'zod';
import type { IAnswer } from '@bambu/shared';
import { useNavigate } from 'react-router-dom';
import IKnowMyRiskProfileAction from './components/IKnowMyRiskProfileAction';
import {
  useSelectInvestorQuestionnaireGroupByKey,
  useSelectSetHasSelectedRiskQuestionnaire,
  useSelectUpdateRiskQuestionnaire,
} from '@bambu/go-core';
import { useEffect } from 'react';

// TODO: think of a better name for questionOne, questionTwo etc because they are not actually first question
// TODO: set default values
const investmentStyleFormSchema = makeValidationSchema({
  name: 'questionOne',
});

export type InvestmentStyleQuestionOneFormState = z.infer<
  typeof investmentStyleFormSchema
>;

export function InvestmentStyleQuestionOne() {
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
    useForm<InvestmentStyleQuestionOneFormState>({
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

  const onSubmit = handleSubmit(({ questionOne }) => {
    updateRiskQuestionnaire({
      questionnaireGroup,
      questionId: id,
      answerId: questionOne,
      answerScoreNumber: null,
    });
    navigate('../investment-style-question-two');
  });

  return (
    <Form onSubmit={onSubmit}>
      <Stack spacing={2} sx={{ pb: '6rem' }}>
        <Stack spacing={2}>
          <Typography variant="h1" textAlign="center" mobiletextalign="left">
            {question}
          </Typography>
          {/** Will need to speak to design about the error toast notification as other forms are displaying the error at the bottom for the form. For consistency. */}
          <InvestmentStyleListControl
            questionnaireAnswers={transformAnswers(questionnaireAnswers)}
            name="questionOne"
            control={control}
          />
          <IKnowMyRiskProfileAction />
        </Stack>
        <InvestmentStyleQuestionaireBottomAction />
      </Stack>
    </Form>
  );
}

export function transformAnswers(answers: IAnswer[]) {
  return answers.map((i) => ({
    ...i,
    title: (
      <Typography fontWeight="bold">
        {i.answer.split('<br/>')[0].trim()}
      </Typography>
    ),
    // TODO : description could have multiple lines
    description: capitalize(i.answer.split('<br/>')[1]?.trim() ?? ''),
  }));
}

export default InvestmentStyleQuestionOne;
