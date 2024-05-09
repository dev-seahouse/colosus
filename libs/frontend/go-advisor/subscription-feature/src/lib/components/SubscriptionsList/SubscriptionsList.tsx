import { Card, Typography, Box } from '@bambu/react-ui';

import SubscriptionDetails from '../SubscriptionDetails/SubscriptionDetails';

export function SubscriptionsList() {
  return (
    <Card>
      <Box display="flex" sx={{ p: 5 }}>
        <Box sx={{ minWidth: 256 }}>
          <Typography fontWeight={700}>Your Bambu GO subscription</Typography>
        </Box>
        <SubscriptionDetails />
      </Box>
    </Card>
  );
}

export default SubscriptionsList;
