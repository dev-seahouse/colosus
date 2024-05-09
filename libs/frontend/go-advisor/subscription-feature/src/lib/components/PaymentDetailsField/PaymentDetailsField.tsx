import { Box, Typography } from '@bambu/react-ui';
import type { ReactNode } from 'react';

export interface PaymentDetailsFieldProps {
  label: string;
  value?: ReactNode;
}

export function PaymentDetailsField({
  label = 'Label',
  value = 'value',
}: PaymentDetailsFieldProps) {
  return (
    <Box display="flex" alignItems="center">
      <Box sx={{ mr: 2, width: 125 }}>
        <Typography>{label}</Typography>
      </Box>
      <Box>
        <Typography fontWeight="bold">{value}</Typography>
      </Box>
    </Box>
  );
}

export default PaymentDetailsField;
