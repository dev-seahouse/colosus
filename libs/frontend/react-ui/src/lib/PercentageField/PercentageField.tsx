import { NumericFormat } from 'react-number-format';
import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';
import type { NumericFormatProps } from 'react-number-format';
import React from 'react';

export type PercentageFieldProps = Omit<TextFieldProps, 'onChange'> &
  NumericFormatProps;

export const PercentageField = React.forwardRef(function PercentageField(
  {
    decimalScale = 1,
    suffix = '%',
    fixedDecimalScale = true,
    ...rest
  }: PercentageFieldProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return (
    <NumericFormat
      suffix={suffix}
      decimalScale={decimalScale}
      fixedDecimalScale={fixedDecimalScale}
      {...rest}
      customInput={TextField}
      inputProps={{ ref: ref }}
    />
  );
});

export default PercentageField;
