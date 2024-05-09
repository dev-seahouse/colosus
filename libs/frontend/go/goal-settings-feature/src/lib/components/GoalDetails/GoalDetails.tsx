import { Box, Typography } from '@bambu/react-ui';
import { useSelectName } from '@bambu/go-core';

export function GoalDetails() {
  const userName = useSelectName();

  return (
    <Box display="flex" alignItems="center">
      <Typography variant="h5" fontSize={'22px'}>
        {userName}, here’s the portfolio that we recommend for your goal.
      </Typography>
    </Box>
  );
}

export default GoalDetails;
