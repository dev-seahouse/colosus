import { useFormContext } from 'react-hook-form';

import type { ScheduleAppointmentFormState } from '../ScheduleAppointmentForm/ScheduleAppointmentForm';
import type { GetFinancialPlanFormState } from '../GetFinancialPlanForm/GetFinancialPlanForm';
import type { ScheduleAppointmentWithLinkFormState } from '../ScheduleAppointmentWithLinkForm/ScheduleAppointmentWithLinkForm';
import { TextField } from '@bambu/react-ui';

export const NameField = () => {
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
      {...register('name')}
      inputProps={{
        'data-testid': 'name-input',
        id: 'name-input',
      }}
      InputLabelProps={{
        htmlFor: 'name-input',
      }}
      label="Name"
      error={!!errors.name}
      helperText={errors.name?.message}
    />
  );
};

export default NameField;
