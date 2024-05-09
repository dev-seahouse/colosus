import { Link, Stack, Typography } from '@bambu/react-ui';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  useSelectHasActiveSubscriptionQuery,
  useSelectUserSubscriptionTypeQuery,
} from '@bambu/go-advisor-core';

export const TransactAssetAllocationLocked = () => {
  const isUserHasActiveSubscription = useSelectHasActiveSubscriptionQuery();
  const subscriptionType = useSelectUserSubscriptionTypeQuery();

  if (isUserHasActiveSubscription.isLoading || subscriptionType.isLoading) {
    return null;
  }

  if (isUserHasActiveSubscription.isError || subscriptionType.isError) {
    return <Typography color={'error'}>Something went wrong</Typography>;
  }

  const linkTo =
    isUserHasActiveSubscription.data && subscriptionType.data
      ? '/dashboard/get-verified'
      : '/select-subscription';

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1}>
        <InfoOutlinedIcon />
        <Typography>
          Feature is only available to{' '}
          <Link to={linkTo} sx={{ fontSize: '1rem' }}>
            verified financial advisors
          </Link>
        </Typography>
      </Stack>
      <Typography>
        To offer a transactional robo-advisor service that handles your clients’
        investments, you’ll first need to verify that you are authorised to
        provide financial advice and manage investments on behalf of your
        clients.
      </Typography>
    </Stack>
  );
};
