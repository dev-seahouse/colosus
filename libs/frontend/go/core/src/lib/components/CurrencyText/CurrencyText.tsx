import type { NumericFormatProps } from 'react-number-format';
import { NumericFormat } from 'react-number-format';
import { useLocalizedCurrencySymbol } from '@bambu/react-ui';

export interface CurrencyTextProps extends NumericFormatProps {
  value: number;
  suffix?: string;
}

export const CurrencyText = ({ value, suffix, ...rest }: CurrencyTextProps) => {
  const currencySymbol = useLocalizedCurrencySymbol();
  return (
    <NumericFormat
      displayType="text"
      value={value}
      prefix={currencySymbol}
      suffix={suffix}
      thousandSeparator
      {...rest}
    />
  );
};

export default CurrencyText;
