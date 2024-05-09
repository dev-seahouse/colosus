import { Box, Button, Card, Link, Stack, Typography } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';
import { InterestedInTransactLogo } from './assets/InterestedInTransactLogo';
import { KYCStatusRejectedLogo } from './assets/KYCStatusRejectedLogo';
import { KYCStatusPendingLogo } from './assets/KYCStatusPendingLogo';
import { KYCStatusApprovedLogo } from './assets/KYCStatusApprovedLogo';
import {
  useSelectUserInterestInTransact,
  useSelectUserKycStatus,
  useSelectUserSubscriptionType,
} from '@bambu/go-advisor-core';

// Transact banner states, will work on logic once ready
const TRANSACT_BANNER_STATES = {
  NO_SUBSCRIPTION_WITH_TRANSACT_INTEREST: {
    title: 'Get verified to unlock Bambu GO’s transactional robo services',
    description:
      'To offer transactional robo-advisor services that handle your clients’ investments, you’ll first need to verify that you are authorised to provide financial advice and manage investments on behalf of your clients.',
    subDescription: null,
    ctaText: 'Subscribe to start verification',
    navigationPath: '/select-subscription',
    logo: <InterestedInTransactLogo />,
  },
  INTERESTED_IN_TRANSACT: {
    title: 'Get verified to set up your robo-advisor with Transact',
    description:
      'To offer transactional robo-advisor services that handle your clients’ investments, you’ll first need to verify that you are authorised to provide financial advice and manage investments on behalf of your clients.',
    subDescription: null,
    ctaText: 'Start Transact verification',
    navigationPath: '../get-verified',
    logo: <InterestedInTransactLogo />,
  },
  KYC_STATUS_IN_PROGRESS: {
    title: 'Your KYC/AML verification is in progress',
    description:
      'Wealth Kernel are currently processing your verification and will contact you via email to guide you through this process.',
    subDescription:
      'In the meantime, you can follow the steps below to continue setting up your platform and engage leads with your own non-transactional robo-advisor.',
    ctaText: null,
    navigationPath: '',
    logo: <KYCStatusPendingLogo />,
  },
  KYC_STATUS_CONFIGURATION_IN_PROGRESS: {
    title: 'Your KYC/AML verification has been approved',
    description:
      'Once you’ve completed the set up steps below, we’ll guide you through the final configurations required to launch your transactional robo.',
    subDescription: null,
    ctaText: null,
    navigationPath: '',
    logo: <KYCStatusPendingLogo />,
  },

  KYC_STATUS_REJECTED: {
    title: 'Unfortunately, your KYC/AML verification has been rejected',
    description: `For details on the reason(s) your submission was rejected, you can contact Wealth Kernel at `,
    subDescription:
      'Please note that this will not affect your ability to create and share your own non-transactional robo-advisor utilising features available for Connect users.',
    ctaText: null,
    navigationPath: '',
    logo: <KYCStatusRejectedLogo />,
  },
  KYC_STATUS_APPROVED: {
    title: 'You’re verified to access Bambu GO’s transactional services',
    description:
      'Once you’ve completed the set up steps below, we’ll guide you through the final configurations required to launch your transactional robo.',
    subDescription: null,
    ctaText: null,
    navigationPath: '',
    logo: <KYCStatusApprovedLogo />,
  },
};

function getBannerContent(
  subscriptionType: string | null,
  isInterestedInTransact: boolean | null,
  kycStatus: string | null
) {
  const isUserSubscribedToConnect = subscriptionType === 'CONNECT';

  if (
    isUserSubscribedToConnect &&
    isInterestedInTransact &&
    kycStatus === 'ACTIVE'
  ) {
    return TRANSACT_BANNER_STATES.KYC_STATUS_APPROVED;
  }

  if (
    isUserSubscribedToConnect &&
    isInterestedInTransact &&
    kycStatus === 'KYC_FAILED'
  ) {
    return TRANSACT_BANNER_STATES.KYC_STATUS_REJECTED;
  }

  if (
    isUserSubscribedToConnect &&
    isInterestedInTransact &&
    kycStatus === 'CONFIGURATION_IN_PROGRESS'
  ) {
    return TRANSACT_BANNER_STATES.KYC_STATUS_CONFIGURATION_IN_PROGRESS;
  }

  if (
    isUserSubscribedToConnect &&
    isInterestedInTransact &&
    kycStatus === 'KYC_IN_PROGRESS'
  ) {
    return TRANSACT_BANNER_STATES.KYC_STATUS_IN_PROGRESS;
  }

  if (isUserSubscribedToConnect && isInterestedInTransact && !kycStatus) {
    return TRANSACT_BANNER_STATES.INTERESTED_IN_TRANSACT;
  }

  // Need to confirm if kyc status will only be there after user subscribes to CONNECT
  if (!subscriptionType && !kycStatus) {
    return TRANSACT_BANNER_STATES.NO_SUBSCRIPTION_WITH_TRANSACT_INTEREST;
  }

  return null;
}

export const TransactBanner = () => {
  const navigate = useNavigate();
  const kycStatus = useSelectUserKycStatus();

  const subscriptionType = useSelectUserSubscriptionType();
  const isInterestedInTransact = useSelectUserInterestInTransact();

  const BANNER_STATE = getBannerContent(
    subscriptionType,
    isInterestedInTransact,
    kycStatus
  );

  if (!BANNER_STATE) return null;

  return (
    <Card sx={{ background: '#F3FFF8', padding: '2rem' }}>
      <Stack direction="row" spacing={4} alignItems="center">
        <Stack spacing={3}>
          <Typography variant="h5">{BANNER_STATE?.title}</Typography>
          <Typography>
            {BANNER_STATE?.description}{' '}
            {kycStatus === 'KYC_FAILED' ? (
              <Link to={`mailto:tenants@wealthkernel.com`}>
                tenants@wealthkernel.com
              </Link>
            ) : null}
          </Typography>
          {BANNER_STATE?.subDescription ? (
            <Typography>{BANNER_STATE?.subDescription} </Typography>
          ) : null}
          {BANNER_STATE?.ctaText ? (
            <Box sx={{ whiteSpace: 'nowrap' }}>
              <Button onClick={() => navigate(BANNER_STATE?.navigationPath)}>
                {BANNER_STATE?.ctaText}
              </Button>
            </Box>
          ) : null}
        </Stack>
        {BANNER_STATE?.logo}
      </Stack>
    </Card>
  );
};

export default TransactBanner;
