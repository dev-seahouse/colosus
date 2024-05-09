import { CurrencyField } from '@bambu/react-ui';
import { Controller, useFormContext } from 'react-hook-form';

export const RecurringDepositField = () => {
  const { control } = useFormContext();

  return (
    <Controller
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <CurrencyField
          label="Monthly recurring deposit"
          placeholder="Enter monthly recurring deposit"
          value={value}
          onValueChange={(e) => {
            onChange(e.floatValue);
          }}
          error={!!error}
          helperText={error?.message}
        />
      )}
      name="monthlyContribution"
      control={control}
    />
  );
};

export default RecurringDepositField;
