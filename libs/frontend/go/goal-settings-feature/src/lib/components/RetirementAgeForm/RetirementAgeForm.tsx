import { Stack, Form, useMobileView, Box } from '@bambu/react-ui';
import { useForm, FormProvider } from 'react-hook-form';
import {
  useSelectAge,
  BottomAction,
  useSelectSetProgress,
  useSelectInvestorQuestionnaireGroupByKey,
  useSelectUpdateRiskQuestionnaire,
} from '@bambu/go-core';
import { z } from 'zod';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import RetirementAgeIcon from './RetirementAgeIcon';
import RetirementAgeAction from '../RetirementAgeAction/RetirementAgeAction';
import GoalSettingsFormHeader from '../../layouts/GoalSettingsFormHeader/GoalSettingsFormHeader';
import {
  useSelectRetirementAge,
  useSelectUpdateRetirementData,
} from '../../store/useGoalSettingsStore.selectors';
import RetirementAgeField from './RetirementAgeField';

export interface RetirementAgeFormState {
  retirementAge: number;
}

export function RetirementAgeForm() {
  const setProgress = useSelectSetProgress();
  useEffect(() => {
    setProgress(5);
  }, [setProgress]);

  const {
    data: questionnaireGroup,
    isSuccess,
    isLoading,
  } = useSelectInvestorQuestionnaireGroupByKey({
    key: 'GOAL',
  });

  const age = useSelectAge() ?? 18;
  const retirementAge = useSelectRetirementAge();
  const updateRetirementData = useSelectUpdateRetirementData();
  const updateRiskQuestionnaireStore = useSelectUpdateRiskQuestionnaire();
  const navigate = useNavigate();
  const retirementAgeFormSchema = useMemo(
    () =>
      z
        .object({
          retirementAge: z
            .number({
              required_error:
                'Your retirement age should be greater than your current age',
            })
            .min(
              age + 1,
              'Your retirement age should be greater than your current age'
            )
            .max(
              81,
              'Your retirement age should not be greater than 81 years old'
            ),
        })
        .required(),
    [age]
  );
  const methods = useForm<RetirementAgeFormState>({
    resolver: zodResolver(retirementAgeFormSchema),
    mode: 'onTouched',
    defaultValues: {
      retirementAge,
    },
  });
  const isMobileView = useMobileView();

  const onSubmit = methods.handleSubmit((data) => {
    if (!isSuccess || isLoading || !questionnaireGroup) return;
    updateRiskQuestionnaireStore({
      questionnaireGroup,
      questionId: questionnaireGroup.Questions[0].id,
      answerScoreNumber: data.retirementAge - age,
      answerId: '',
    });
    updateRetirementData(data);
    navigate('../monthly-expenses');
  });

  return (
    <FormProvider {...methods}>
      <Form
        id="retirement-age-form"
        data-testid="retirement-age-form"
        onSubmit={onSubmit}
      >
        <Stack spacing={8}>
          <Stack spacing={2}>
            <GoalSettingsFormHeader
              Icon={RetirementAgeIcon}
              title="When do you want to retire?"
            />
            <RetirementAgeField />
            {isMobileView && (
              <BottomAction>
                <RetirementAgeAction />
              </BottomAction>
            )}
          </Stack>
          {!isMobileView && (
            <Box display="flex" justifyContent="space-around">
              <RetirementAgeAction />
            </Box>
          )}
        </Stack>
      </Form>
    </FormProvider>
  );
}

export default RetirementAgeForm;
