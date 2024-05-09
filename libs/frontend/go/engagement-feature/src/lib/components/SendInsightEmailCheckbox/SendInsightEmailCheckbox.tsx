import { FormControlLabel, Checkbox, FormControl, Box } from '@bambu/react-ui';
import { useFormContext, Controller } from 'react-hook-form';

import type { ScheduleAppointmentFormState } from '../ScheduleAppointmentForm/ScheduleAppointmentForm';
import type { ScheduleAppointmentWithLinkFormState } from '../ScheduleAppointmentWithLinkForm/ScheduleAppointmentWithLinkForm';

export function SendInsightEmailCheckbox() {
  const { control } = useFormContext<
    ScheduleAppointmentFormState | ScheduleAppointmentWithLinkFormState
  >();

  return (
    <Controller
      render={({ field: { onChange }, formState: { errors } }) => (
        <FormControl error={errors.hasAgreed !== undefined}>
          <FormControlLabel
            control={
              <Checkbox
                inputProps={{
                  'aria-label': 'agree to receive financial insight via email',
                }}
                onChange={onChange}
              />
            }
            label={
              <Box ml={1}>
                I want to receive a copy of my financial insight in my email
              </Box>
            }
          />
        </FormControl>
      )}
      name="sendGoalProjectionEmail"
      control={control}
    />
  );
}

export default SendInsightEmailCheckbox;
