import {
  Box,
  Form,
  Stack,
  CurrencyField,
  useMobileView,
} from '@bambu/react-ui';
import { BottomAction, useSelectSetProgress } from '@bambu/go-core';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import GrowMyWealthAction from './GrowMyWealthAction';
import GrowMyWealthIcon from './GrowMyWealthIcon';
import GoalSettingsFormHeader from '../../layouts/GoalSettingsFormHeader/GoalSettingsFormHeader';
import { useNavigate } from 'react-router-dom';

import { useEffect } from 'react';

const growMyWealthFormSchema = z
  .object({
    initialInvestment: z
      .number({ required_error: 'Investment amount must be $1 or higher' })
      .min(1, 'Investment amount must be $1 or higher'),
  })
  .required();

export type GrowMyWealthFormState = z.infer<typeof growMyWealthFormSchema>;

// currently unused, grow my wealth uses GoaltimeFrame form
export function GrowMyWealthForm() {
  const isMobileView = useMobileView();
  // const submitGrowMyWealthGoal = useSelectSubmitGrowMyWealthGoal();
  const navigate = useNavigate();
  // const initialInvestment = useSelectGrowMyWealthInitialInvestment();
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<GrowMyWealthFormState>({
    resolver: zodResolver(growMyWealthFormSchema),
    defaultValues: {
      // initialInvestment,
    },
    mode: 'onTouched',
  });

  const onSubmit = handleSubmit((data) => {
    // submitGrowMyWealthGoal(data);
    navigate('../investment-style');
  });

  const setProgress = useSelectSetProgress();

  useEffect(() => {
    setProgress(5);
  }, [setProgress]);

  return (
    <Form
      id="grow-my-wealth-form"
      data-testid="grow-my-wealth-form"
      onSubmit={onSubmit}
    >
      <Stack spacing={2}>
        <GoalSettingsFormHeader
          Icon={GrowMyWealthIcon}
          title="How much would you like to invest?"
        />
        <Controller
          render={({ field: { onChange, value } }) => (
            <CurrencyField
              allowNegative={false}
              label="Investment Amount"
              placeholder="Enter investment amount"
              value={value}
              onValueChange={(e) => {
                onChange(e.floatValue);
              }}
              error={!!errors.initialInvestment}
              helperText={
                errors.initialInvestment?.message ?? 'An approximate is fine'
              }
            />
          )}
          name="initialInvestment"
          control={control}
        />
        {!isMobileView && (
          <Box display="flex" justifyContent="space-around">
            <GrowMyWealthAction />
          </Box>
        )}
      </Stack>
      {isMobileView && (
        <BottomAction>
          <GrowMyWealthAction />
        </BottomAction>
      )}
    </Form>
  );
}

export default GrowMyWealthForm;
