import { NumericFormat } from 'react-number-format';
import { TextField } from '@bambu/react-ui';
import { Controller, useFormContext } from 'react-hook-form';

import type { RetirementAgeFormState } from './RetirementAgeForm';

export const RetirementAgeField = () => {
  const { control } = useFormContext<RetirementAgeFormState>();

  return (
    <Controller
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <NumericFormat
          decimalScale={0}
          allowNegative={false}
          label="Retirement age"
          placeholder="Enter retirement age"
          customInput={TextField}
          value={value}
          onValueChange={(e) => {
            onChange(e.floatValue);
          }}
          error={!!error}
          suffix=" years old"
          helperText={error?.message}
        />
      )}
      name="retirementAge"
      control={control}
    />
  );
};

export default RetirementAgeField;
