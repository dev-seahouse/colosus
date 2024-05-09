import { Typography, Stack } from '@bambu/react-ui';
import { useSelectFirstNameQuery } from '@bambu/go-advisor-core';
import { Box, Button } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';
import Banner from '../Banner/Banner';

export const ReadyToSubscribeBanner = () => {
  const { data: firstName } = useSelectFirstNameQuery();
  const navigate = useNavigate();

  const handleSubscribe = () => navigate('/select-subscription');

  return (
    <Banner data-testid="ready-to-subscribe-banner">
      <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
        <Stack spacing={1} sx={{ flexGrow: 1 }}>
          <Typography variant="h5">Great job, {firstName}!</Typography>
          <Typography>
            Subscribe now to preview the robo-advisor you’ve created.
          </Typography>
        </Stack>
        <Box sx={{ minWidth: 192 }} display="flex" justifyContent="flex-end">
          <Button variant="outlined" onClick={handleSubscribe}>
            Subscribe to see my robo
          </Button>
        </Box>
      </Box>
    </Banner>
  );
};

export default ReadyToSubscribeBanner;
