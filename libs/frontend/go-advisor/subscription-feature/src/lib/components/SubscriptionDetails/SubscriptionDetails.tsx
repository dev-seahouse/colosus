import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  ButtonGroup,
} from '@bambu/react-ui';
import SubscriptionFee from '../SubscriptionFee/SubscriptionFee';
import { useSelectSubscriptionQuery } from '../../hooks/useGetSubscriptions/useGetSubscriptions.selectors';

import CreateBillingSessionButton from '../CreateBillingSessionButton/CreateBillingSessionButton';

export function SubscriptionDetails() {
  const { data: subscription } = useSelectSubscriptionQuery();

  if (!subscription) {
    return null;
  }

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2 }}>
        <Stack spacing={3}>
          <Box display="flex" alignItems="center">
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5">
                {subscription.subscriptionPlan}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5">
                <SubscriptionFee
                  currency={subscription.currency}
                  subscriptionInterval={subscription.subscriptionInterval}
                  subscriptionFee={subscription.subscriptionFee}
                />
              </Typography>
            </Box>
          </Box>
          <Box>
            <Stack spacing={2}>
              <Typography>
                To manage your plan, you will be securely directed to Stripe.
                Simply login using your business email address that you used to
                make payment for the subscription.
              </Typography>
              <Box>
                <ButtonGroup>
                  <CreateBillingSessionButton label="Manage plan" />
                  <CreateBillingSessionButton label="Manage payment method" />
                  <CreateBillingSessionButton label="View invoices" />
                </ButtonGroup>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default SubscriptionDetails;
