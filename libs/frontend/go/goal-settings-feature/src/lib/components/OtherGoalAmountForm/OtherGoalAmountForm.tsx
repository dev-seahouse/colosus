import {
  Box,
  Form,
  Stack,
  CurrencyField,
  useMobileView,
} from '@bambu/react-ui';
import { BottomAction, useSelectSetProgress } from '@bambu/go-core';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import OtherGoalAmountIcon from './OtherGoalAmountIcon';
import OtherGoalAmountAction from './OtherGoalAmountAction';
import {
  useSelectUpdateOtherData,
  useSelectOtherGoalValue,
} from '../../store/useGoalSettingsStore.selectors';
import GoalSettingsFormHeader from '../../layouts/GoalSettingsFormHeader/GoalSettingsFormHeader';
import { useEffect } from 'react';

const otherGoalAmountFormSchema = z
  .object({
    goalValue: z
      .number({ required_error: 'Your target amount must be $1 or higher' })
      .min(1, 'Your target amount must be $1 or higher'),
  })
  .required();

export type OtherGoalAmountFormState = z.infer<
  typeof otherGoalAmountFormSchema
>;

export function OtherGoalAmountForm() {
  const isMobileView = useMobileView();
  const navigate = useNavigate();
  const goalValue = useSelectOtherGoalValue();
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<OtherGoalAmountFormState>({
    resolver: zodResolver(otherGoalAmountFormSchema),
    defaultValues: {
      goalValue,
    },
    mode: 'onTouched',
  });
  const updateOtherData = useSelectUpdateOtherData();

  const onSubmit = handleSubmit((data) => {
    updateOtherData(data);
    navigate('../year');
  });

  const setProgress = useSelectSetProgress();

  useEffect(() => {
    setProgress(25);
  }, [setProgress]);

  return (
    <Form
      id="other-goal-amount-form"
      data-testid="other-goal-amount-form"
      onSubmit={onSubmit}
    >
      <Stack spacing={8}>
        <Stack spacing={2}>
          <GoalSettingsFormHeader
            Icon={OtherGoalAmountIcon}
            title="What is the target amount for this goal?"
          />
          <Controller
            render={({ field: { onChange, value } }) => (
              <CurrencyField
                allowNegative={false}
                label="Target Amount"
                placeholder="Enter target amount"
                value={value}
                onValueChange={(e) => {
                  onChange(e.floatValue);
                }}
                error={!!errors.goalValue}
                helperText={
                  errors.goalValue?.message ?? 'An approximate is fine'
                }
              />
            )}
            name="goalValue"
            control={control}
          />
        </Stack>
        {!isMobileView && (
          <Box display="flex" justifyContent="space-around">
            <OtherGoalAmountAction />
          </Box>
        )}
      </Stack>
      {isMobileView && (
        <BottomAction>
          <OtherGoalAmountAction />
        </BottomAction>
      )}
    </Form>
  );
}

export default OtherGoalAmountForm;
