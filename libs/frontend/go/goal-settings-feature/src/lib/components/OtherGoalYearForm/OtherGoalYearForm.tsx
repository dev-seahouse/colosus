import {
  Box,
  Form,
  MenuItem,
  Select,
  Stack,
  useMobileView,
} from '@bambu/react-ui';
import {
  BottomAction,
  useSelectInvestorQuestionnaireGroupByKey,
  useSelectSetProgress,
  useSelectUpdateRiskQuestionnaire,
} from '@bambu/go-core';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import OtherGoalYearAction from './OtherGoalYearAction';
import OtherGoalYearIcon from './OtherGoalYearIcon';
import {
  useSelectOtherGoalYear,
  useSelectSubmitOtherGoal,
} from '../../store/useGoalSettingsStore.selectors';
import GoalSettingsFormHeader from '../../layouts/GoalSettingsFormHeader/GoalSettingsFormHeader';
import { useNavigate } from 'react-router-dom';
import generateGoalYearOptions from '../../utils/generateGoalYearOptions/generateGoalYearOptions';
import { useEffect } from 'react';

const otherGoalYearFormSchema = z
  .object({
    goalYear: z
      .number({ required_error: 'Your goal year is required' })
      .min(1, 'Your goal year is required'),
  })
  .required();

export type OtherGoalYearFormState = z.infer<typeof otherGoalYearFormSchema>;

const GOAL_YEAR_OPTIONS = generateGoalYearOptions(80);

export function OtherGoalYearForm() {
  const {
    data: questionnaireGroup,
    isSuccess,
    isLoading,
  } = useSelectInvestorQuestionnaireGroupByKey({
    key: 'GOAL',
  });

  const setProgress = useSelectSetProgress();
  useEffect(() => {
    setProgress(50);
  }, [setProgress]);

  const isMobileView = useMobileView();
  const navigate = useNavigate();
  const goalYear = useSelectOtherGoalYear();
  const updateRiskQuestionnaireStore = useSelectUpdateRiskQuestionnaire();
  const submitOtherGoal = useSelectSubmitOtherGoal();
  const { control, handleSubmit } = useForm<OtherGoalYearFormState>({
    resolver: zodResolver(otherGoalYearFormSchema),
    defaultValues: {
      goalYear,
    },
    mode: 'onTouched',
  });

  const onSubmit = handleSubmit((data) => {
    if (!isSuccess || isLoading || !questionnaireGroup) return;
    updateRiskQuestionnaireStore({
      questionnaireGroup,
      questionId: questionnaireGroup.Questions[0].id,
      answerScoreNumber: data.goalYear - new Date().getFullYear(),
      answerId: '',
    });
    submitOtherGoal(data);
    navigate('../investment-style');
  });

  return (
    <Form
      id="other-goal-year-form"
      data-testid="other-goal-year-form"
      onSubmit={onSubmit}
    >
      <Stack spacing={8}>
        <Stack spacing={2}>
          <GoalSettingsFormHeader
            Icon={OtherGoalYearIcon}
            title="When do you plan to accomplish this?"
          />
          <Controller
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Select
                label="Year"
                fullWidth
                error={!!error}
                helperText={error?.message}
                {...field}
              >
                {GOAL_YEAR_OPTIONS.map((option) => (
                  <MenuItem key={option.label} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            )}
            name="goalYear"
          />
        </Stack>
        {!isMobileView && (
          <Box display="flex" justifyContent="space-around">
            <OtherGoalYearAction />
          </Box>
        )}
      </Stack>
      {isMobileView && (
        <BottomAction>
          <OtherGoalYearAction />
        </BottomAction>
      )}
    </Form>
  );
}

export default OtherGoalYearForm;
