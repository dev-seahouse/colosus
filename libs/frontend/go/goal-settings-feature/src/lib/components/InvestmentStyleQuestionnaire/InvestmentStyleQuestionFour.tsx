import { Form, MenuItem, Select, Stack, Typography } from '@bambu/react-ui';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InvestmentStyleQuestionaireBottomAction } from './components/InvestmentStyleQuestionaireBottomAction';
import type { z } from 'zod';
import { makeValidationSchema } from './utils/makeValidationSchema';
import type {
  RiskQuestionnaire,
  TransformedInvestorRiskQuestionnaireGrouping,
} from '@bambu/go-core';
import {
  useSelectGetRiskQuestionnaire,
  useSelectInvestorQuestionnaireGroupByKey,
  useSelectSetHasSelectedRiskQuestionnaire,
  useSelectSetUserData,
  useSelectUpdateRiskQuestionnaire,
} from '@bambu/go-core';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useComputeRiskProfileScore from '../../hooks/useComputeRiskScore/useComputeRiskScore';
import {
  type ConnectInvestorRiskProfileTypes,
  type ConnectInvestorRiskQuestionnaireAnswer,
  makeRiskScorePayloadSchema,
} from '@bambu/api-client';

const investmentStyleFormSchema = makeValidationSchema({
  name: 'questionFour',
});
const riskScorePayloadSchema = makeRiskScorePayloadSchema();
export type InvestmentStyleQuestionFourFormState = z.infer<
  typeof investmentStyleFormSchema
>;

// TODO: think of a better name for questionOne, questionTwo etc because they are not actually first question
// TODO: set default values
export function InvestmentStyleQuestionFour() {
  const setRiskQuestionnaireSelection =
    useSelectSetHasSelectedRiskQuestionnaire();
  const updateRiskQuestionnaire = useSelectUpdateRiskQuestionnaire();
  const setUserData = useSelectSetUserData();
  const riskQuestionnaire = useSelectGetRiskQuestionnaire();
  const { mutate } = useComputeRiskProfileScore();
  const navigate = useNavigate();

  useEffect(() => {
    setRiskQuestionnaireSelection(true);
  }, [setRiskQuestionnaireSelection]);

  const {
    isLoading,
    isSuccess,
    data: questionnaireGroup,
  } = useSelectInvestorQuestionnaireGroupByKey({ key: 'FINANCIAL_HEALTH' });

  const questionFour = ''; // questionId

  const { handleSubmit, control } =
    useForm<InvestmentStyleQuestionFourFormState>({
      resolver: zodResolver(investmentStyleFormSchema),
      defaultValues: { questionFour },
    });

  if (isLoading || !isSuccess || !questionnaireGroup) {
    return null;
  }

  const { question, Answers: options, id } = questionnaireGroup.Questions[1];
  const onSubmit = handleSubmit(({ questionFour }) => {
    updateRiskQuestionnaire({
      questionnaireGroup,
      questionId: id,
      answerId: questionFour,
      answerScoreNumber: null,
    });

    // we cannot expect updateRiskQuestionnaire to update the state immediately after calling it
    // ,so we need to pass the updated state to the computeRiskProfileScore
    const riskScorePayload = transformInputToPayload(
      questionnaireGroup,
      riskQuestionnaire,
      id,
      questionFour
    );

    if (riskScorePayloadSchema.safeParse(riskScorePayload).success) {
      mutate(riskScorePayload, {
        onSuccess: (data) => {
          setUserData({
            riskAppetite: data.modelRiskProfile
              .riskProfileName as ConnectInvestorRiskProfileTypes,
            riskProfileId: data.modelRiskProfile.riskProfileId as string,
          });
          navigate('../investment-style-result');
        },
      });
    } else {
      // if we don't get complete data, user probably has refreshed the page and store data is lost
      navigate('/getting-to-know-you/name');
    }
  });

  return (
    <Form onSubmit={onSubmit}>
      <Stack spacing={10} sx={{ pb: [0, 4] }}>
        <Stack spacing={3}>
          <Typography variant="h1" textAlign="center" mobiletextalign="left">
            {question}
          </Typography>
          <Controller
            name="questionFour"
            control={control}
            render={({ field }) => (
              <Select
                label="Select liquid assets percentage"
                fullWidth
                {...field}
              >
                {options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.answer}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </Stack>
      </Stack>
      <InvestmentStyleQuestionaireBottomAction />
    </Form>
  );
}

export default InvestmentStyleQuestionFour;

// transform inputs into computeRiskScorePayload
function transformInputToPayload(
  questionnaireGroup: TransformedInvestorRiskQuestionnaireGrouping,
  riskQuestionnaire: RiskQuestionnaire | null,
  answerQuestionId: string,
  answerId: string
) {
  return {
    questionnaireId: questionnaireGroup.riskQuestionnaireId,
    questionnaireVersion: questionnaireGroup.riskQuestionnaireVersion,
    answers: mergeQuestionnaireAnswers({
      prevQuestionnaireState: riskQuestionnaire,
      questionGroupId: questionnaireGroup.id,
      answerQuestionId: answerQuestionId,
      answerId: answerId,
    }),
  };
}

// merge answer with previous state and remove duplicates
function mergeQuestionnaireAnswers({
  prevQuestionnaireState,
  questionGroupId,
  answerQuestionId,
  answerId,
}: {
  prevQuestionnaireState: RiskQuestionnaire | null;
  questionGroupId: string;
  answerQuestionId: string;
  answerId: string;
}) {
  // remove previous answer with questionId if exists to prevent duplicates
  const filteredQuestionnaireAnswers =
    prevQuestionnaireState?.questionnaireAnswers?.filter(
      byQuestionId(answerQuestionId)
    ) ?? [];

  // prepare new payload
  const newAnswer: ConnectInvestorRiskQuestionnaireAnswer = {
    questionId: answerQuestionId,
    answerId: answerId,
    answerScoreNumber: null,
    questionGroupingId: questionGroupId,
  };

  // append new answer object to previous answers
  return [...filteredQuestionnaireAnswers, newAnswer];
}

function byQuestionId(questionId: string) {
  return (b: ConnectInvestorRiskQuestionnaireAnswer) =>
    b.questionId !== questionId;
}
