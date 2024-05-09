import {
  Box,
  Form,
  Stack,
  useMobileView,
  MenuItem,
  Select,
} from '@bambu/react-ui';
import {
  BottomAction,
  useSelectAge,
  useSelectInvestorQuestionnaireGroupByKey,
  useSelectSetProgress,
  useSelectUpdateRiskQuestionnaire,
} from '@bambu/go-core';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import GoalTimeframeAction from './GoalTimeframeAction';
import GrowMyWealthIcon from './GrowMyWealthIcon';
import GoalSettingsFormHeader from '../../layouts/GoalSettingsFormHeader/GoalSettingsFormHeader';
import {
  useSelectGrowMyWealthGoalYear,
  useSelectSubmitGrowMyWealthGoal,
} from '../../store/useGoalSettingsStore.selectors';
import { useNavigate } from 'react-router-dom';

import { useEffect } from 'react';
import { generateGoalYearOptions } from '../../utils/generateGoalYearOptions/generateGoalYearOptions';

const goalTimelineSchema = z
  .object({
    goalYear: z.number().min(1, 'Goal year is required'),
  })
  .required();

export type GoalTimeframeState = z.infer<typeof goalTimelineSchema>;

export function GoalTimeframeForm() {
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

  const userAge = useSelectAge();
  const goalYearOptions = generateGoalYearOptions(99 - (userAge || 0));

  const isMobileView = useMobileView();
  const submitGrowMyWealthGoal = useSelectSubmitGrowMyWealthGoal();
  const updateRiskQuestionnaireStore = useSelectUpdateRiskQuestionnaire();
  const navigate = useNavigate();
  const goalYear = useSelectGrowMyWealthGoalYear();

  const { handleSubmit, control } = useForm<GoalTimeframeState>({
    resolver: zodResolver(goalTimelineSchema),
    defaultValues: {
      goalYear,
    },
    mode: 'onTouched',
  });
  const onSubmit = handleSubmit((data) => {
    if (!isSuccess || isLoading || !questionnaireGroup) return;
    submitGrowMyWealthGoal(data);
    updateRiskQuestionnaireStore({
      questionnaireGroup,
      questionId: questionnaireGroup.Questions[0].id,
      answerScoreNumber: data.goalYear - new Date().getFullYear(),
      answerId: '',
    });
    navigate('../investment-style');
  });

  return (
    <Form
      id="grow-my-wealth-form"
      data-testid="grow-my-wealth-form"
      onSubmit={onSubmit}
    >
      <Stack spacing={2}>
        <GoalSettingsFormHeader
          Icon={GrowMyWealthIcon}
          title="What is your intended timeline for accomplishing this goal?"
        />
        <Controller
          name="goalYear"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Select
              id="goal-year"
              label="Select Goal Year"
              fullWidth
              error={!!error}
              helperText={error?.message}
              {...field}
            >
              {goalYearOptions?.map((option) => (
                <MenuItem key={option.label} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {!isMobileView && (
          <Box display="flex" justifyContent="space-around">
            <GoalTimeframeAction />
          </Box>
        )}
      </Stack>
      {isMobileView && (
        <BottomAction>
          <GoalTimeframeAction />
        </BottomAction>
      )}
    </Form>
  );
}

export default GoalTimeframeForm;
