import {
  ErrorLoadingCard,
  GoAppLayout,
  RecommendationBanner,
  useGetDirectDebitSubscriptions,
  useSelectActiveDirectDebitMandate,
} from '@bambu/go-core';
import {
  Box,
  Button,
  Container,
  enqueueSnackbar,
  Stack,
  Typography,
} from '@bambu/react-ui';
import RspDepositDetailsCard from '../../components/RspDepositDetailsCard/RspDepositDetailsCard';
import { useNavigate, useParams } from 'react-router-dom';
import { InvestorBrokerageUkDirectDebitSubscriptionStatusEnum } from '@bambu/api-client';
import useCancelDirectDebitSubscription from '../../hooks/useCancelDirectDebitSubscription/useCancelDirectDebitSubscription';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export function CancelRecurringDepositPage() {
  const navigate = useNavigate();
  const { goalId } = useParams();
  const {
    data: activeDirectDebitMandate,
    isLoading: isLoadingDirectDebitMandate,
  } = useSelectActiveDirectDebitMandate();

  const {
    data: activeDirectDebitSubscription,
    isLoading: isLoadingDirectDebitSubscriptions,
  } = useGetDirectDebitSubscriptions(
    {
      goalId: goalId ?? '',
      limit: 2,
      mandateId: activeDirectDebitMandate?.id ?? '',
      status: InvestorBrokerageUkDirectDebitSubscriptionStatusEnum.ACTIVE,
    },
    {
      enabled: !!goalId && !!activeDirectDebitMandate?.id,
      select: (data) => data.results[0],
    }
  );

  const {
    mutate: cancelDirectDebitSubscription,
    isLoading: isCancellingDirectDebitSubscriptions,
  } = useCancelDirectDebitSubscription();

  function handleCancelClick() {
    cancelDirectDebitSubscription(
      {
        subscriptionId: activeDirectDebitSubscription?.id ?? '',
      },
      {
        onSuccess: () => {
          enqueueSnackbar(
            <Stack direction={'row'} alignItems={'center'} spacing={2}>
              <CheckCircleIcon color={'success'} />
              <Typography fontSize={'14px'}>
                Your request to terminate the recurring deposit has been
                approved.
              </Typography>
            </Stack>,
            {
              variant: 'long_success',
            }
          );
          navigate('/dashboard');
        },
        onError: () => {
          enqueueSnackbar('Error cancelling recurring deposit', {
            variant: 'error',
          });
        },
      }
    );
  }

  if (!goalId) {
    console.error('There is no goal id');
    return <ErrorLoadingCard />;
  }

  if (!activeDirectDebitSubscription) {
    console.error('There is no direct debit subscription');
    return <ErrorLoadingCard />;
  }

  return (
    <GoAppLayout>
      <Container>
        <Stack spacing={1.6}>
          <Typography component={'h1'} fontSize={'22px'}>
            Cancel recurring deposit
          </Typography>

          <RspDepositDetailsCard />

          <Box py={1}>
            <RecommendationBanner isShown={true}>
              Opting for the early exit in your recurring deposit prematurely
              could hinder your financial aspirations from fully blossoming
            </RecommendationBanner>
          </Box>

          <Box
            sx={{
              position: ['fixed', 'static'],
              display: 'flex',
              bottom: 50,
              left: 0,
              right: 0,
              px: 3,
              justifyContent: ['center', 'flex-end'],
              width: '100%',
              gap: 2,
            }}
          >
            <Button
              variant={'outlined'}
              sx={{ flexGrow: [1, 0] }}
              onClick={() => navigate(-1)}
              disabled={isCancellingDirectDebitSubscriptions}
            >
              Stay investing
            </Button>
            <Button
              onClick={handleCancelClick}
              sx={{ flexGrow: [1, 0] }}
              isLoading={
                isLoadingDirectDebitSubscriptions ||
                isLoadingDirectDebitMandate ||
                isCancellingDirectDebitSubscriptions
              }
            >
              {' '}
              Terminate
            </Button>
          </Box>
        </Stack>
      </Container>
    </GoAppLayout>
  );
}

export default CancelRecurringDepositPage;
