import { CurrencyField } from '@bambu/react-ui';
import { Controller, useFormContext } from 'react-hook-form';

import type { CurrencyFieldProps } from '@bambu/react-ui';
import type { RetirementMonthlyExpensesFormState } from './RetirementMonthlyExpensesForm';

export interface RetirementMonthlyExpensesFieldProps {
  label?: CurrencyFieldProps['label'];
  helperText?: CurrencyFieldProps['helperText'];
}

export const RetirementMonthlyExpensesField = ({
  label = 'Monthly expenses',
  helperText,
}: RetirementMonthlyExpensesFieldProps) => {
  const { control } = useFormContext<RetirementMonthlyExpensesFormState>();

  return (
    <Controller
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <CurrencyField
          label={label}
          placeholder="Enter monthly expenses"
          value={value}
          onValueChange={(e) => {
            onChange(e.floatValue);
          }}
          error={!!error}
          helperText={error?.message || helperText}
        />
      )}
      name="monthlyExpenses"
      control={control}
    />
  );
};

export default RetirementMonthlyExpensesField;
