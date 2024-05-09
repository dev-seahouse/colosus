import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Box,
  Button,
  enqueueSnackbar,
  Form,
  Paper,
  Stack,
  Typography,
} from '@bambu/react-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import WithdrawalAmountField from '../WithdrawalAmountField/WithdrawalAmountField';
import {
  ErrorLoadingCard,
  getActiveMandate,
  LoadingCard,
  PaymentTransferCard,
  useAppBar,
  useGetBankAccountById,
  useGetDirectDebitMandates,
  useGetInvestorGoalDetails,
} from '@bambu/go-core';
import { useNavigate, useParams } from 'react-router-dom';
import useCreateWithdrawalRequest from '../../hooks/useCreateWithdrawalRequest/useCreateWithdrawalRequest';
import { InvestorBrokerageIntegrationWithdrawalTypeEnum } from '@bambu/api-client';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const getWithdrawalFormSchema = () =>
  z.object({
    withdrawalAmount: z
      .number({ required_error: 'Your withdrawal amount is required.' })
      .min(1),
  });

type WithdrawalFormValues = z.infer<ReturnType<typeof getWithdrawalFormSchema>>;

export function WithdrawalForm() {
  const navigate = useNavigate();
  const { show } = useAppBar();
  const { goalId } = useParams();
  const { data: goal, isLoading: isLoadingGoal } = useGetInvestorGoalDetails(
    { goalId: goalId ?? '' },
    { enabled: !!goalId }
  );

  const {
    data: mandates,
    isLoading: isDirectDebitMandateLoading,
    isError: isMandatesError,
  } = useGetDirectDebitMandates();

  const {
    mutate: createWithdrawalRequest,
    isLoading: isCreatingWithdrawalRequest,
  } = useCreateWithdrawalRequest();

  const activeMandate = getActiveMandate(mandates);

  const {
    data: bankAccount,
    isLoading: isLoadingBankAccount,
    fetchStatus: bankAccountFetchStatus,
    isError: isBankAccountError,
  } = useGetBankAccountById(
    { bankAccountId: activeMandate?.bankAccountId ?? '' },
    { enabled: activeMandate?.bankAccountId != null }
  );

  const methods = useForm<WithdrawalFormValues>({
    resolver: zodResolver(getWithdrawalFormSchema()),
    mode: 'onTouched',
  });

  const handleSubmit = methods.handleSubmit((data) => {
    createWithdrawalRequest(
      {
        goalId: goalId ?? '',
        bankAccountId: bankAccount?.id ?? '',
        consideration: {
          amount: data.withdrawalAmount,
          currency: 'GBP',
        },
        type: InvestorBrokerageIntegrationWithdrawalTypeEnum.SpecifiedAmount,
        closePortfolio: false,
      },
      {
        onSuccess: () => {
          enqueueSnackbar(
            <Stack direction={'row'} alignItems={'center'} spacing={2}>
              <CheckCircleIcon color={'success'} />
              <Box>
                <Typography fontSize={'14px'} fontWeight={400}>
                  Your withdrawal request for “{goal?.goalDescription}” is
                  currently being processed. The transaction process will take
                  around 1-3 days.
                </Typography>
              </Box>
            </Stack>,
            {
              variant: 'long_success',
              anchorOrigin: { vertical: 'top', horizontal: 'center' },
            }
          );
          navigate('/dashboard');
        },
        onError: () => {
          enqueueSnackbar('Something went wrong', {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
          });
        },
      }
    );
  });

  if (isDirectDebitMandateLoading || isLoadingGoal) {
    return <LoadingCard />;
  }

  if (isLoadingBankAccount && bankAccountFetchStatus !== 'idle') {
    return <LoadingCard />;
  }

  if (isMandatesError) {
    console.error('Error loading direct debit mandates');
    return <ErrorLoadingCard />;
  }

  if (isBankAccountError) {
    console.error('Error loading bank account');
    return <ErrorLoadingCard />;
  }

  if (!activeMandate) {
    return (
      <Typography
        variant={'body2'}
        fontWeight={400}
        fontSize={10}
        color={'#494949'}
        lineHeight={1.8}
      >
        You do not have an active mandate.
      </Typography>
    );
  }

  return (
    <FormProvider {...methods}>
      <Form
        id={'withdrawal-form'}
        data-testid={'withdrawal-form'}
        onSubmit={handleSubmit}
      >
        <Stack spacing={2.2}>
          {isCreatingWithdrawalRequest && show()}
          <Stack component={Paper} p={2} spacing={2} elevation={2}>
            <WithdrawalAmountField />

            <Typography
              variant={'caption'}
              color={'#494949'}
              fontSize={'10px'}
              lineHeight={1.6}
            >
              The withdrawal amount indicated will be transferred to your linked
              bank account once the transaction is completed.
            </Typography>
            <Typography
              variant={'caption'}
              color={'#494949'}
              fontSize={'10px'}
              lineHeight={1.6}
            >
              Please note that the amount you've entered is an estimated figure,
              and the final amount may vary due to transaction and execution
              fees.
            </Typography>
          </Stack>

          <PaymentTransferCard title={'Transfer to'} />

          <Stack direction="row" spacing={2}>
            <Button
              variant={'outlined'}
              sx={{ flexGrow: 1 }}
              onClick={() => navigate(-1)}
              isLoading={isCreatingWithdrawalRequest}
            >
              Cancel
            </Button>
            <Button
              type={'submit'}
              sx={{ flexGrow: 1 }}
              isLoading={
                isCreatingWithdrawalRequest || !activeMandate || !bankAccount
              }
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Form>
    </FormProvider>
  );
}

export default WithdrawalForm;
