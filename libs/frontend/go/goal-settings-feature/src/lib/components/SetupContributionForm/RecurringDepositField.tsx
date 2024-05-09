import { Controller, useFormContext } from 'react-hook-form';
import { CurrencyField } from '@bambu/react-ui';
import { CurrencyText } from '@bambu/go-core';
import { MIN_RECURRING_DEPOSIT } from './SetupRecommendationForm.definition';

export const RecurringDepositField = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="recurringDeposit"
      control={control}
      render={({ field: { onChange, onBlur, value }, fieldState }) => (
        <CurrencyField
          defaultValue={value}
          onValueChange={(v) => {
            onChange(v.floatValue);
          }}
          onBlur={onBlur}
          label="Monthly recurring deposit"
          placeholder="Enter monthly recurring deposit"
          error={!!fieldState.error}
          helperText={
            fieldState.error?.message ?? (
              <>
                Min monthly recurring deposit of{' '}
                {<CurrencyText value={MIN_RECURRING_DEPOSIT} />}
              </>
            )
          }
          /*        helperText={
            fieldState.error?.message ??
            `Min monthly recurring deposit of ${formatCurrency.format(
              MIN_RECURRING_DEPOSIT
            )}`
          } */
          decimalScale={0}
          allowNegative={false}
        />
      )}
    />
  );
};
