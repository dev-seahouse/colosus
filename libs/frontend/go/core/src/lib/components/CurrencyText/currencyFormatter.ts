import { NumericFormatProps, numericFormatter } from 'react-number-format';

export function currencyFormatter(
  value: number | string,
  options: NumericFormatProps = {
    prefix: '$',
    thousandSeparator: true,
  }
) {
  if (isNaN(Number(value))) throw new Error('value must be a number.');
  return numericFormatter(String(value), options);
}

export default currencyFormatter;
