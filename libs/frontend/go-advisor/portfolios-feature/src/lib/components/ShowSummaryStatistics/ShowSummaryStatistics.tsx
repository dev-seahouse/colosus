import { Box, Checkbox, FormControl, Typography } from '@bambu/react-ui';

export function ShowSummaryStatistics({ field }: { field: object }) {
  return (
    <FormControl {...field}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Checkbox {...field} defaultChecked />
        <Typography variant="body2">
          Show expected return and expected volatility to investors.
        </Typography>
      </Box>
    </FormControl>
  );
}

export default ShowSummaryStatistics;
