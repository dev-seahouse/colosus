import { Controller, useFormContext } from 'react-hook-form';
import { CurrencyField } from '@bambu/react-ui';

export function WithdrawalAmountField() {
  const { control } = useFormContext();

  return (
    <Controller
      name={'withdrawalAmount'}
      control={control}
      render={({ field: { onChange, ...rest }, fieldState }) => (
        <CurrencyField
          onValueChange={(v) => {
            onChange(v.floatValue);
          }}
          label="Withdrawal amount"
          placeholder="Enter withdrawal amount"
          error={!!fieldState.error}
          decimalScale={0}
          allowNegative={false}
          helperText={fieldState.error?.message}
          {...rest}
        />
      )}
    />
  );
}

export default WithdrawalAmountField;
