import { Typography, Stack } from '@bambu/react-ui';

export function PortfolioSummaryV2() {
  return (
    <Stack spacing={2}>
      <Typography fontWeight={700}>Balanced Portfolio</Typography>
      <Typography>
        This portfolio is suitable for investors who are seeking average returns
        and are ready to tolerate some price fluctuations. It has a mid to
        long-term investment time horizon.
      </Typography>
    </Stack>
  );
}

export default PortfolioSummaryV2;
