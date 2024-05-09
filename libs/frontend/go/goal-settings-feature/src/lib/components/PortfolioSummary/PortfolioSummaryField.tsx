import { Stack, Typography } from '@bambu/react-ui';
import type { ReactNode } from 'react';

export interface PortfolioSummaryFieldProps {
  label: string;
  value: ReactNode;
}

export const PortfolioSummaryField = ({
  label = 'label',
  value = '-',
}: PortfolioSummaryFieldProps) => (
  <Stack spacing={1}>
    <Typography variant="subtitle2" color="grey.600">
      {label}
    </Typography>
    <Typography fontWeight={700}>{value}</Typography>
  </Stack>
);

export default PortfolioSummaryField;
