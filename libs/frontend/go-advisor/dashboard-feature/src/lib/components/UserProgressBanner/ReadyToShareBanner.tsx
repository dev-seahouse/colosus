import { Typography, Stack } from '@bambu/react-ui';

import {
  useSelectSubdomainQuery,
  useSelectUserSubscriptionTypeQuery,
} from '@bambu/go-advisor-core';
import { Box } from '@bambu/react-ui';
import Banner from '../Banner/Banner';
import RoboControl from '../RoboControl/RoboControl';

export const ReadyToShareBanner = () => {
  const { data: roboName } = useSelectSubdomainQuery();

  const { data: subscriptionType } = useSelectUserSubscriptionTypeQuery();
  const isUserTransact = subscriptionType === 'TRANSACT';

  return (
    <Banner data-testid="ready-to-share-banner">
      <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
        <Stack spacing={1} sx={{ flexGrow: 1 }}>
          <Typography variant="h5">"{roboName}" is now live</Typography>
          <Typography>
            {isUserTransact
              ? 'Your can share your transactional robo-advisor with your prospective clients to grow your clients and AUM.'
              : 'Your can share your non-transactional robo-advisor with your prospective clients or use it in your sales and marketing strategies.'}
          </Typography>
        </Stack>
        <RoboControl />
      </Box>
    </Banner>
  );
};

export default ReadyToShareBanner;
