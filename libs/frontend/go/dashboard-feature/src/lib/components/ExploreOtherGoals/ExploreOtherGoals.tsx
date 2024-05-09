import { Box, Stack, Typography, Button } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';

import { ExploreGoalIcon } from '@bambu/go-core';

export function ExploreGoal() {
  const navigate = useNavigate();

  return (
    <Box display="flex" px={3} py={3} alignItems="center">
      <Box mr={2}>
        <ExploreGoalIcon color="primary" sx={{ width: 48, height: 48 }} />
      </Box>
      <Stack flexGrow={1} spacing={2}>
        <Stack spacing={1}>
          <Typography fontWeight={700}>
            Got a different goal in mind?
          </Typography>
          <Typography>
            We can help you plan for a wide range of financial goals
          </Typography>
        </Stack>
        <Button onClick={() => navigate('../select-goal')} variant="outlined">
          Explore other goals
        </Button>
      </Stack>
    </Box>
  );
}

export default ExploreGoal;
