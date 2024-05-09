import { Box, Form, Stack, TextField, useMobileView } from '@bambu/react-ui';
import { BottomAction, useSelectSetProgress } from '@bambu/go-core';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import OtherGoalNameAction from './OtherGoalNameAction';

import OtherGoalNameIcon from './OtherGoalNameIcon';
import {
  useSelectOtherGoalName,
  useSelectUpdateOtherData,
} from '../../store/useGoalSettingsStore.selectors';
import GoalSettingsFormHeader from '../../layouts/GoalSettingsFormHeader/GoalSettingsFormHeader';
import { useEffect } from 'react';

const otherGoalNameFormSchema = z
  .object({
    goalName: z
      .string({ required_error: 'Your goal name is required' })
      .min(1, 'Your goal name is required'),
  })
  .required();

export type OtherGoalNameFormState = z.infer<typeof otherGoalNameFormSchema>;

export function OtherGoalNameForm() {
  const isMobileView = useMobileView();
  const navigate = useNavigate();
  const goalName = useSelectOtherGoalName();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<OtherGoalNameFormState>({
    resolver: zodResolver(otherGoalNameFormSchema),
    defaultValues: {
      goalName: goalName !== 'I have another goal in mind' ? goalName : '',
    },
    mode: 'onTouched',
  });
  const updateOtherData = useSelectUpdateOtherData();

  const onSubmit = handleSubmit((data) => {
    updateOtherData(data);
    navigate('../amount');
  });

  const setProgress = useSelectSetProgress();

  useEffect(() => {
    setProgress(5);
  }, [setProgress]);

  return (
    <Form
      id="other-goal-name-form"
      data-testid="other-goal-name-form"
      onSubmit={onSubmit}
    >
      <Stack spacing={8}>
        <Stack spacing={2}>
          <GoalSettingsFormHeader
            Icon={OtherGoalNameIcon}
            title="Let’s give your goal a name."
          />
          <TextField
            {...register('goalName')}
            inputProps={{
              'data-testid': 'goal-name-input',
              id: 'goal-name-input',
            }}
            InputLabelProps={{
              htmlFor: 'goal-name-input',
            }}
            label="Goal name"
            error={!!errors.goalName}
            helperText={errors.goalName?.message}
          />
        </Stack>
        {!isMobileView && (
          <Box display="flex" justifyContent="space-around">
            <OtherGoalNameAction />
          </Box>
        )}
      </Stack>
      {isMobileView && (
        <BottomAction>
          <OtherGoalNameAction />
        </BottomAction>
      )}
    </Form>
  );
}

export default OtherGoalNameForm;
