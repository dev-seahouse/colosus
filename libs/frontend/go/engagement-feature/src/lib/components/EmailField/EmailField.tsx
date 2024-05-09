import { useFormContext } from 'react-hook-form';

import type { ScheduleAppointmentFormState } from '../ScheduleAppointmentForm/ScheduleAppointmentForm';
import type { GetFinancialPlanFormState } from '../GetFinancialPlanForm/GetFinancialPlanForm';
import type { ScheduleAppointmentWithLinkFormState } from '../ScheduleAppointmentWithLinkForm/ScheduleAppointmentWithLinkForm';

import { TextField } from '@bambu/react-ui';

export const EmailField = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<
    | ScheduleAppointmentFormState
    | GetFinancialPlanFormState
    | ScheduleAppointmentWithLinkFormState
  >();

  return (
    <TextField
      {...register('email')}
      inputProps={{
        'data-testid': 'email-input',
        id: 'email-input',
      }}
      InputLabelProps={{
        htmlFor: 'email-input',
      }}
      label="Email"
      error={!!errors.email}
      helperText={errors.email?.message}
    />
  );
};

export default EmailField;
