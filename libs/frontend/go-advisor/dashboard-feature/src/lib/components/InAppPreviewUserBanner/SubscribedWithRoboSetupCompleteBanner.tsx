import { useState } from 'react';
import { Typography, Stack, Button, Box } from '@bambu/react-ui';
import Banner from '../Banner/Banner';
import { useSelectUsernameQuery } from '@bambu/go-advisor-core';
import ShareRoboDialog from '../RoboControl/ShareRoboDialog';

export const SubscribedWithRoboSetupComplete = () => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const { data: username } = useSelectUsernameQuery();

  return (
    <Box sx={{ width: '100%' }}>
      <Banner data-testid="subscribed-user-banner-with-robo-setup-completed">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Stack>
            <Typography variant="h5">
              <span role="img" aria-label="wave emoji">
                🚀
              </span>{' '}
              Excellent work {username}, your robo looks awesome!
            </Typography>
            <Typography>
              Share your robo-advisor to start engaging clients and capturing
              more leads.
            </Typography>
          </Stack>
          <Box sx={{ whiteSpace: 'nowrap' }}>
            <Button variant="outlined" onClick={handleClickOpen}>
              Share with client
            </Button>
          </Box>
        </Box>
      </Banner>
      <ShareRoboDialog open={open} handleClose={handleClose} />
    </Box>
  );
};

export default SubscribedWithRoboSetupComplete;
