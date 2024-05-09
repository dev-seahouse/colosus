import {
  CurrencyField,
  MenuItem,
  Select,
  useMobileView,
  Form,
  Box,
  Stack,
} from '@bambu/react-ui';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { BottomAction, useSelectSetProgress } from '@bambu/go-core';
import DownPaymentAction from './DownPaymentAction';
import { HouseIcon } from '../../icons/HouseIcon';
import GoalSettingsFormHeader from '../../layouts/GoalSettingsFormHeader/GoalSettingsFormHeader';
import {
  useSelectHouseDownPaymentPercentage,
  useSelectUpdateHouseData,
  useSelectHousePrice,
} from '../../store/useGoalSettingsStore.selectors';
import { useEffect } from 'react';

const downPaymentFormSchema = z
  .object({
    downPaymentPercentage: z.string(),
    housePrice: z
      .number({ required_error: 'Your house price must be $1 or higher' })
      .min(1, 'Your house price must be $1 or higher'),
  })
  .required();

export type DownPaymentFormState = z.infer<typeof downPaymentFormSchema>;

function generatePercentOptions(start = 5, end = 100, increment = 5) {
  const options = [];
  for (let i = start; i <= end; i += increment) {
    options.push({
      value: String(i),
      label: `${i}%`,
    });
  }
  return options;
}

// 5% to 100%
const DOWN_PAYMENT_OPTIONS = generatePercentOptions();

export function DownPaymentForm() {
  const isMobile = useMobileView();
  const updateHouseData = useSelectUpdateHouseData();
  const downPaymentPercentage = useSelectHouseDownPaymentPercentage();
  const housePrice = useSelectHousePrice();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<DownPaymentFormState>({
    resolver: zodResolver(downPaymentFormSchema),
    mode: 'onTouched',
    defaultValues: {
      downPaymentPercentage,
      housePrice,
    },
  });
  const navigate = useNavigate();
  const setProgress = useSelectSetProgress();

  useEffect(() => {
    setProgress(5);
  }, [setProgress]);

  const onSubmit = (data: DownPaymentFormState) => {
    updateHouseData(data);
    navigate('../purchase-year');
  };

  return (
    <Form
      id="downpayment-form"
      data-testid="downpayment-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={8}>
        <Stack spacing={2}>
          <GoalSettingsFormHeader
            Icon={HouseIcon}
            title="How much is the downpayment for this house?"
          />
          <Stack spacing={1}>
            <Controller
              name="downPaymentPercentage"
              control={control}
              render={({ field }) => (
                <Select label="Downpayment percentage" fullWidth {...field}>
                  {DOWN_PAYMENT_OPTIONS.map((option) => (
                    <MenuItem key={option.label} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <Controller
              name="housePrice"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <CurrencyField
                  allowNegative={false}
                  label="House price"
                  placeholder="Enter house price"
                  value={value}
                  error={!!error}
                  helperText={
                    error?.message ??
                    'We’ll use this to determine how much a down payment you’ll need to save'
                  }
                  onValueChange={(e) => {
                    onChange(e.floatValue);
                  }}
                />
              )}
            />
          </Stack>
        </Stack>
        {!isMobile && (
          <Box display="flex" justifyContent="space-around">
            <DownPaymentAction />
          </Box>
        )}
      </Stack>
      {isMobile && (
        <BottomAction>
          <DownPaymentAction />
        </BottomAction>
      )}
    </Form>
  );
}

export default DownPaymentForm;
