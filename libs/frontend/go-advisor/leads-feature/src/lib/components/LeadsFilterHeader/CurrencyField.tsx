import { Box, Typography, useLocalizedCurrencySymbol } from '@bambu/react-ui';
import { NumericFormat } from 'react-number-format';

export interface CurrencyFieldProps {
  label: string;
  value?: number | null;
}

export const CurrencyField = ({ label, value = 0 }: CurrencyFieldProps) => {
  const currencySymbol = useLocalizedCurrencySymbol();
  return (
    <Box display="flex" alignItems="center">
      <Box mr={1}>
        <Typography variant="subtitle2">{label}</Typography>
      </Box>
      <Typography variant="subtitle2" fontWeight={700}>
        <NumericFormat
          value={value}
          displayType="text"
          prefix={currencySymbol}
          thousandSeparator
        />
      </Typography>
    </Box>
  );
};

export default CurrencyField;
