import { useSelectHasActiveSubscriptionQuery } from '@bambu/go-advisor-core';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const SubscriptionAccordionStatus = () => {
  const { data: userHasActiveSubscription } =
    useSelectHasActiveSubscriptionQuery();

  if (userHasActiveSubscription) {
    return <CheckCircleIcon color="success" />;
  }

  return null;
};

export default SubscriptionAccordionStatus;
