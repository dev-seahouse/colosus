import { Stack, Typography } from '@bambu/react-ui';

export interface LeadStatsProps {
  title?: string;
  value?: number | string;
}

export const LeadStats = ({
  title = 'No of leads',
  value = 0,
}: LeadStatsProps) => (
  <Stack spacing={1}>
    <Typography variant="subtitle2">{title}</Typography>
    <Typography variant="h2" sx={{ fontSize: '3rem' }} fontWeight={700}>
      {value}
    </Typography>
  </Stack>
);

export default LeadStats;
