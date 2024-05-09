import { Typography, Stack, Button, Box } from '@bambu/react-ui';
import Banner from '../Banner/Banner';
import { useSelectUsernameQuery } from '@bambu/go-advisor-core';
import { useNavigate } from 'react-router-dom';

export const SubscribedWithRoboSetupIncomplete = () => {
  const { data: username } = useSelectUsernameQuery();
  const navigate = useNavigate();
  return (
    <Banner data-testid="subscribed-user-banner-with-robo-setup-incomplete">
      <Box display="flex" alignItems="center">
        <Stack>
          <Typography variant="h5">
            <span role="img" aria-label="wave emoji">
              🚀
            </span>{' '}
            Great job {username}! Make it uniquely yours.
          </Typography>
          <Typography>
            When you’re ready, you can continue to prepare your robo for launch
            by following the setup tasks on the dashboard.
          </Typography>
        </Stack>
        <Box sx={{ whiteSpace: 'nowrap' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard/home')}
          >
            Go to dashboard
          </Button>
        </Box>
      </Box>
    </Banner>
  );
};

export default SubscribedWithRoboSetupIncomplete;
