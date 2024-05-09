import {
  CurrencyField,
  Stack,
  Form,
  useMobileView,
  Box,
} from '@bambu/react-ui';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { BottomAction, useSelectSetProgress } from '@bambu/go-core';
import TotalCollegeFeesAction from '../TotalCollegeFeesAction/TotalCollegeFeesAction';
import { BooksIcon } from '../../icons/BooksIcon';
import GoalSettingsFormHeader from '../../layouts/GoalSettingsFormHeader/GoalSettingsFormHeader';
import {
  useSelectEducationFees,
  useSelectUpdateEducationData,
} from '../../store/useGoalSettingsStore.selectors';
import { useEffect } from 'react';

const totalCollegeFeesFormSchema = z.object({
  collegeFees: z
    .number({
      required_error: 'Your child’s college fees must be $1 or higher',
    })
    .min(1, 'Your child’s college fees must be $1 or higher'),
});

type TotalCollegeFeesFormState = z.infer<typeof totalCollegeFeesFormSchema>;

export function TotalCollegeFeesForm() {
  const collegeFees = useSelectEducationFees();
  const updateEducationData = useSelectUpdateEducationData();
  const { handleSubmit, control } = useForm<TotalCollegeFeesFormState>({
    resolver: zodResolver(totalCollegeFeesFormSchema),
    defaultValues: {
      collegeFees,
    },
    mode: 'onTouched',
  });
  const navigate = useNavigate();
  const isMobileView = useMobileView();

  const onSubmit = (data: TotalCollegeFeesFormState) => {
    updateEducationData(data);
    navigate('../start-year');
  };
  const setProgress = useSelectSetProgress();

  useEffect(() => {
    setProgress(5);
  }, [setProgress]);

  return (
    <Form
      id="total-college-fees-form"
      data-testid="total-college-fees-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={8}>
        <Stack spacing={2}>
          <GoalSettingsFormHeader
            Icon={BooksIcon}
            title="How much are the total college fees?"
          />
          <Controller
            name="collegeFees"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CurrencyField
                label="College fees"
                placeholder="Enter college fees"
                value={value}
                onValueChange={(e) => {
                  onChange(e.floatValue);
                }}
                error={!!error}
                helperText={error?.message ?? 'An approximate is fine'}
              />
            )}
          />
        </Stack>
        {!isMobileView && (
          <Box display="flex" justifyContent="space-around">
            <TotalCollegeFeesAction />
          </Box>
        )}
      </Stack>
      {isMobileView && (
        <BottomAction>
          <TotalCollegeFeesAction />
        </BottomAction>
      )}
    </Form>
  );
}

export default TotalCollegeFeesForm;
