import { Typography } from '@bambu/react-ui';
import { useSelectName } from '@bambu/go-core';

export function GoalInsightHeadline() {
  const name = useSelectName() ?? '-';

  return (
    <Typography variant="h5">
      {name}, here’s the portfolio that we recommend for your goal.
    </Typography>
  );
}

export default GoalInsightHeadline;
