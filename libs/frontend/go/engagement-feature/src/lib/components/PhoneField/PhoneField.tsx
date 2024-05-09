import { Controller, useFormContext } from 'react-hook-form';

import type { ScheduleAppointmentFormState } from '../ScheduleAppointmentForm/ScheduleAppointmentForm';
import type { ScheduleAppointmentWithLinkFormState } from '../ScheduleAppointmentWithLinkForm/ScheduleAppointmentWithLinkForm';

import { MuiTelInput } from 'mui-tel-input';

export const PhoneField = () => {
  const { control } = useFormContext<
    ScheduleAppointmentFormState | ScheduleAppointmentWithLinkFormState
  >();

  return (
    <Controller
      render={({ field }) => (
        <MuiTelInput
          inputProps={{
            'data-testid': 'phone-input',
            id: 'phone-input',
          }}
          InputLabelProps={{
            htmlFor: 'phone-input',
          }}
          defaultCountry="US"
          label="Phone number"
          placeholder="Enter phone number"
          {...field}
        />
      )}
      name="phoneNumber"
      control={control}
    />
  );
};

export default PhoneField;
