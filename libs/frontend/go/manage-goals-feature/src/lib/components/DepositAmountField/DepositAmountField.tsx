import { Controller, useFormContext } from 'react-hook-form';
import { CurrencyField, Typography } from '@bambu/react-ui';

export function DepositAmountField() {
  const { control } = useFormContext();
  return (
    <Controller
      name={'depositAmount'}
      control={control}
      render={({ field: { onChange, ...rest }, fieldState }) => (
        <CurrencyField
          onValueChange={(v) => {
            onChange(v.floatValue);
          }}
          label="Deposit amount"
          placeholder="Enter deposit amount"
          error={!!fieldState.error}
          decimalScale={0}
          allowNegative={false}
          helperText={
            fieldState.error?.message ?? (
              <Typography color="text.primary" variant={'caption'}>
                Min deposit of $1
              </Typography>
            )
          }
          {...rest}
        />
      )}
    />
  );
}

export default DepositAmountField;
