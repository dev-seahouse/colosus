import { Controller, useFormContext } from 'react-hook-form';
import { CurrencyField } from '@bambu/react-ui';
import { CurrencyText } from '@bambu/go-core';
import { MIN_INITIAL_DEPOSIT } from './SetupRecommendationForm.definition';

// TODO: abstract this
export const InitialDepositField = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="initialDeposit"
      control={control}
      render={({ field: { onChange, onBlur, value }, fieldState }) => (
        <CurrencyField
          defaultValue={value}
          onValueChange={(v) => {
            onChange(v.floatValue);
          }}
          onBlur={onBlur}
          label="Initial deposit"
          placeholder="Enter initial deposit"
          error={!!fieldState.error}
          helperText={
            fieldState.error?.message ?? (
              <>
                Min deposit of <CurrencyText value={MIN_INITIAL_DEPOSIT} />
              </>
            )
          }
          decimalScale={0}
          allowNegative={false}
        />
      )}
    />
  );
};
