/* eslint-disable-next-line */

import { Stack, Typography, Box, Button } from '@bambu/react-ui';
import type { PropsWithChildren } from 'react';
import NoDataImage from './assets/noDataGraphics.svg';
import { useNavigate } from 'react-router-dom';
import { useSelectHasActiveSubscriptionQuery } from '@bambu/go-advisor-core';
import { ShareRoboButton } from '@bambu/go-advisor-dashboard-feature';

type NoDataProps = PropsWithChildren;
export function NoData({ children }: NoDataProps) {
  const navigate = useNavigate();

  const { data: userHasActiveSubscription } =
    useSelectHasActiveSubscriptionQuery();
  const handleGoToSelectSubscription = () => navigate('/select-subscription');
  return (
    <Stack
      direction="row"
      spacing={3}
      justifyContent={'center'}
      alignItems={'center'}
      sx={{ paddingBottom: '2rem' }}
    >
      <img src={NoDataImage} alt="no data found" />
      <Stack spacing={2}>
        <Typography variant="h6">No leads captured yet</Typography>
        {!userHasActiveSubscription ? (
          <>
            <Typography>
              Subscribe today to start sharing your robo-advisor <br /> with
              prospective clients and capturing leads.
            </Typography>
            <Box>
              <Button onClick={handleGoToSelectSubscription}>
                Subscribe for US$99/mo.
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography>
              Share your robo-advisor with your prospective
              <br />
              clients or use it in your sales and marketing
              <br />
              strategies.
            </Typography>
            <Box>
              <ShareRoboButton />
            </Box>
          </>
        )}
      </Stack>
    </Stack>
  );
}

export default NoData;
