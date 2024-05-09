import { CurrencyField } from '@bambu/react-ui';
import { Controller, useFormContext } from 'react-hook-form';

export const InitialDepositField = () => {
  const { control } = useFormContext();

  return (
    <Controller
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <CurrencyField
          label="Initial deposit"
          placeholder="Enter initial deposit"
          value={value}
          onValueChange={(e) => {
            onChange(e.floatValue);
          }}
          error={!!error}
          helperText={error?.message}
        />
      )}
      name="initialInvestment"
      control={control}
    />
  );
};

export default InitialDepositField;
