import { ExploreGoal } from '@bambu/go-core';
import { Stack, Typography } from '@bambu/react-ui';

export function ThingsToDoRightNow() {
  return (
    <Stack spacing={1}>
      <Typography fontWeight={700}>In the meantime</Typography>
      <ExploreGoal />
    </Stack>
  );
}

export default ThingsToDoRightNow;
