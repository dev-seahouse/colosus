import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useMobileView,
  MenuItem,
  Select,
  Stack,
  Form,
  Box,
} from '@bambu/react-ui';
import { z } from 'zod';

import {
  BottomAction,
  useSelectInvestorQuestionnaireGroupByKey,
  useSelectSetProgress,
  useSelectUpdateRiskQuestionnaire,
} from '@bambu/go-core';
import { useNavigate } from 'react-router-dom';

import PurchaseYearAction from './PurchaseYearAction';
import { TimeIcon } from '../../icons/TimeIcon';
import GoalSettingsFormHeader from '../../layouts/GoalSettingsFormHeader/GoalSettingsFormHeader';
// import useNavigateToGoalinsight from '../../hooks/useNavigateToGoalInsight/useNavigateToGoalInsight';

import {
  useSelectHousePurchaseYear,
  useSelectSubmitHouseGoal,
} from '../../store/useGoalSettingsStore.selectors';
import { useEffect } from 'react';

// TODO: duplicated, move to utils
function generateYearsOptions({
  start = new Date().getFullYear() + 1,
  howManyYears = 50,
} = {}) {
  const years = [];
  for (let i = 0; i < howManyYears; i += 1) {
    years.push({
      label: `${start + i}`,
      value: start + i,
    });
  }
  return years;
}

const purchaseYearFormSchema = z
  .object({
    purchaseYear: z
      .number()
      .min(1, 'Your purchase year to buy a house is required'),
  })
  .required();

export type PurchaseYearFormState = z.infer<typeof purchaseYearFormSchema>;
const PURCHASE_YEAR_OPTIONS = generateYearsOptions();

export function PurchaseYearForm() {
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

  const isMobileView = useMobileView();
  const purchaseYear = useSelectHousePurchaseYear();
  const updateRiskQuestionnaireStore = useSelectUpdateRiskQuestionnaire();
  const navigate = useNavigate();

  const submitHouseGoal = useSelectSubmitHouseGoal();
  // const navigate = useNavigateToGoalinsight();
  const { control, handleSubmit } = useForm<PurchaseYearFormState>({
    resolver: zodResolver(purchaseYearFormSchema),
    mode: 'onTouched',
    defaultValues: {
      purchaseYear,
    },
  });

  const onSubmit = (data: PurchaseYearFormState) => {
    if (!isSuccess || isLoading || !questionnaireGroup) return;
    updateRiskQuestionnaireStore({
      questionnaireGroup,
      questionId: questionnaireGroup.Questions[0].id,
      answerScoreNumber: Number(data.purchaseYear - new Date().getFullYear()),
      answerId: '',
    });
    submitHouseGoal(data);
    navigate('../investment-style');
  };

  return (
    <Form
      id="purchase-year-form"
      data-testid="purchase-year-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={8}>
        <Stack spacing={2}>
          <GoalSettingsFormHeader
            Icon={TimeIcon}
            title="When do you plan to buy this house?"
          />
          <Controller
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Select
                label="Purchase year"
                fullWidth
                error={!!error}
                helperText={
                  error?.message ??
                  'We’ll use this to determine how much a down payment you’ll need to save'
                }
                {...field}
              >
                {PURCHASE_YEAR_OPTIONS.map((option) => (
                  <MenuItem key={option.label} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            )}
            name="purchaseYear"
          />
        </Stack>
        {!isMobileView && (
          <Box display="flex" justifyContent="space-around">
            <PurchaseYearAction />
          </Box>
        )}
      </Stack>
      {isMobileView && (
        <BottomAction>
          <PurchaseYearAction />
        </BottomAction>
      )}
    </Form>
  );
}

export default PurchaseYearForm;
