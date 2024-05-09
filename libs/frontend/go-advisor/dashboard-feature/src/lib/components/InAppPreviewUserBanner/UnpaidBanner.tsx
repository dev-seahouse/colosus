import { Typography, Stack, Box, Button } from '@bambu/react-ui';
import Banner from '../Banner/Banner';
import { useSelectUsernameQuery } from '@bambu/go-advisor-core';
import { useNavigate } from 'react-router-dom';

export const UnpaidBanner = () => {
  const { data: username } = useSelectUsernameQuery();
  const navigate = useNavigate();

  return (
    <Banner data-testid="unpaid-user-banner">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ gap: 2 }}
      >
        <Stack spacing={1}>
          <Typography variant="h5">
            <span role="img" aria-label="wave emoji">
              🚀
            </span>{' '}
            Hi {username}, want to make it a reality?
          </Typography>
          <Typography>
            Subscribe to start sharing your robo-advisor with prospective
            clients through your sales and marketing strategies.
          </Typography>
        </Stack>
        <Box sx={{ whiteSpace: 'nowrap' }}>
          <Button onClick={() => navigate('/select-subscription')}>
            Subscribe for US$99/mo.
          </Button>
        </Box>
      </Box>
    </Banner>
  );
};

export default UnpaidBanner;
