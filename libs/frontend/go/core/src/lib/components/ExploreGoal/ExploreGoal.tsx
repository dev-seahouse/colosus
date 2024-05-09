import { Box, Button, Paper, Stack, Typography } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';
import ExploreGoalIcon from './ExploreGoalIcon';

export function ExploreGoal() {
  const navigate = useNavigate();

  const handleNavigateToSelectGoal = () => {
    navigate('/select-goal');
  };

  return (
    <Paper square elevation={0}>
      <Box display="flex" px={4} py={3} alignItems="center">
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
          <Button onClick={handleNavigateToSelectGoal} variant="outlined">
            Explore other goals
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}

export default ExploreGoal;
