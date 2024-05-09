import { NumericFormat } from 'react-number-format';
export interface CurrencyTextProps {
  value: number;
  suffix?: string;
}
// TODO: move this to react-ui
export const CurrencyText = ({ value, suffix }: CurrencyTextProps) => (
  <NumericFormat
    displayType="text"
    prefix="$"
    suffix={suffix}
    value={value}
    thousandSeparator
  />
);
export default CurrencyText;
