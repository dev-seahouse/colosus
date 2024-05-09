import { Typography, Stack, Box, Button } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';

export const InactiveSubscriptionDetails = () => {
  const navigate = useNavigate();

  const handleGoToSelectSubscription = () => navigate('/select-subscription');

  return (
    <Stack
      spacing={2}
      sx={{ flexGrow: 1 }}
      data-testid="inactive-subscription-details"
    >
      <Stack spacing={3}>
        <Typography fontWeight="bold">
          Are you ready to engage and capture leads at scale?
        </Typography>
        <Typography>
          Subscribe to start sharing your robo-advisor with prospective clients
          through your sales and marketing strategies. No contracts or hidden
          costs and you can cancel anytime.
        </Typography>
      </Stack>
      <Box>
        <Button onClick={handleGoToSelectSubscription}>
          Subscribe for US$99/mo.
        </Button>
      </Box>
    </Stack>
  );
};
export default InactiveSubscriptionDetails;
