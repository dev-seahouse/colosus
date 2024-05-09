import type { NumericFormatProps } from 'react-number-format';
import { NumericFormat } from 'react-number-format';

import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import { useLocalizedCurrencySymbol } from '../hooks/useLocalizedCurrencySymbol/useLocalizedCurrencySymbol';

// omitting size because otherwise <TextField size="small" /> would error
export type CurrencyFieldProps = Omit<TextFieldProps, 'onChange'> &
  Omit<NumericFormatProps, 'size'>;

export function CurrencyField({
  decimalScale = 0,
  thousandSeparator = true,
  ...rest
}: CurrencyFieldProps) {
  const symbol = useLocalizedCurrencySymbol();

  return (
    <NumericFormat
      prefix={symbol}
      decimalScale={0}
      thousandSeparator={thousandSeparator}
      {...rest}
      customInput={TextField}
    />
  );
}

export default CurrencyField;
