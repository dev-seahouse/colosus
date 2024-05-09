import { NumericFormat } from 'react-number-format';

export interface PercentageTextProps {
  value: number;
  suffix?: string;
}

export const PercentageText = ({
  value,
  suffix = '%',
}: PercentageTextProps) => {
  return (
    <NumericFormat
      displayType="text"
      suffix={suffix}
      value={value}
      decimalScale={1}
      fixedDecimalScale
    />
  );
};

export default PercentageText;
