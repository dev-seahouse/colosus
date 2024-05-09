import {
  Stack,
  useMobileView,
  Form,
  Box,
  MenuItem,
  Select,
} from '@bambu/react-ui';
import {
  BottomAction,
  useSelectInvestorQuestionnaireGroupByKey,
  useSelectSetProgress,
  useSelectUpdateRiskQuestionnaire,
} from '@bambu/go-core';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TimeIcon } from '../../icons/TimeIcon';
import GoalSettingsFormHeader from '../../layouts/GoalSettingsFormHeader/GoalSettingsFormHeader';
import { useSelectEducationStartYear } from '../../store/useGoalSettingsStore.selectors';
import CollegeStartYearAction from '../CollegeStartYearAction/CollegeStartYearAction';
import generateGoalYearOptions from '../../utils/generateGoalYearOptions/generateGoalYearOptions';
import { useSelectSubmitEducationGoal } from '../../store/useGoalSettingsStore.selectors';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const collegeStartFormSchema = z
  .object({
    collegeStartYear: z
      .number()
      .min(1, 'Your child’s college start year is required '),
  })
  .required();

type CollegeStartFormState = z.infer<typeof collegeStartFormSchema>;

const GOAL_YEAR_OPTIONS = generateGoalYearOptions(24);

export function CollegeStartYearForm() {
  const setProgress = useSelectSetProgress();
  useEffect(() => {
    setProgress(10);
  }, [setProgress]);

  const {
    data: questionnaireGroup,
    isSuccess,
    isLoading,
  } = useSelectInvestorQuestionnaireGroupByKey({
    key: 'GOAL',
  });

  const collegeStartYear = useSelectEducationStartYear();
  const isMobileView = useMobileView();
  const submitOtherGoal = useSelectSubmitEducationGoal();
  const updateRiskQuestionnaireStore = useSelectUpdateRiskQuestionnaire();
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm<CollegeStartFormState>({
    resolver: zodResolver(collegeStartFormSchema),
    mode: 'onTouched',
    defaultValues: {
      collegeStartYear,
    },
  });

  const onSubmit = (data: CollegeStartFormState) => {
    if (!isSuccess || isLoading || !questionnaireGroup) return;
    submitOtherGoal(data);
    updateRiskQuestionnaireStore({
      questionnaireGroup,
      questionId: questionnaireGroup.Questions[0].id,
      answerScoreNumber: data.collegeStartYear - new Date().getFullYear(),
      answerId: '',
    });
    navigate('../investment-style');
  };

  return (
    <Form
      id="college-start-year-form"
      data-testid="college-start-year-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={8}>
        <Stack spacing={2}>
          <GoalSettingsFormHeader
            Icon={TimeIcon}
            title="When is your child entering college?"
          />
          <Controller
            name="collegeStartYear"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Select
                id="college-start-year"
                label="College start year"
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
          />
        </Stack>
        {isMobileView && (
          <BottomAction>
            <CollegeStartYearAction />
          </BottomAction>
        )}
        {!isMobileView && (
          <Box display="flex" justifyContent="space-around">
            <CollegeStartYearAction />
          </Box>
        )}
      </Stack>
    </Form>
  );
}

export default CollegeStartYearForm;
