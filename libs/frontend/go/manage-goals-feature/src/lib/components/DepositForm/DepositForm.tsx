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
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import DepositAmountField from '../DepositAmountField/DepositAmountField';
import {
  ErrorLoadingCard,
  getActiveMandate,
  PaymentTransferCard,
  useAppBar,
  useCreateDirectDebitPayment,
  useGetDirectDebitMandates,
  useGetInvestorGoalDetails,
} from '@bambu/go-core';
import { useNavigate, useParams } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useIsFetching } from '@tanstack/react-query';

const getDepositFormValidationSchema = (minAmount: number) =>
  z
    .object({
      depositAmount: z
        .number({
          required_error: 'Deposit amount is required',
        })
        .min(minAmount, `Amount must be greater than ${minAmount}`),
    })
    .required();

export type DepositFormValues = z.infer<
  ReturnType<typeof getDepositFormValidationSchema>
>;

const MIN_DEPOSIT_FROM_API = 1;
export function DepositForm() {
  const { goalId } = useParams();
  const { show } = useAppBar();
  const isFetchingBankAccount = useIsFetching({
    queryKey: ['getBankAccountById'],
  });
  const { data: goal, isLoading: isLoadingGoal } = useGetInvestorGoalDetails(
    { goalId: goalId ?? '' },
    { enabled: !!goalId }
  );
  const navigate = useNavigate();
  const { data: directDebitMandates, isLoading: isDirectDebitsLoading } =
    useGetDirectDebitMandates();
  const activeMandate = getActiveMandate(directDebitMandates);
  const methods = useForm<DepositFormValues>({
    mode: 'onTouched',
    resolver: zodResolver(getDepositFormValidationSchema(MIN_DEPOSIT_FROM_API)),
    defaultValues: {
      depositAmount: 0,
    },
  });
  const { mutate: createPayment, isLoading: isCreatingPayment } =
    useCreateDirectDebitPayment();

  if (!goalId) {
    console.error('Goal id is required');
    return <ErrorLoadingCard />;
  }
  const onSubmit = methods.handleSubmit((data) => {
    if (!activeMandate) {
      enqueueSnackbar(
        'Please set up a Direct Debit mandate before setting up payments',
        {
          variant: 'info',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        }
      );
      navigate(`/direct-debit-mandate-setup`);
      return;
    }

    createPayment(
      {
        mandateId: activeMandate?.id,
        goalId: goalId,
        amount: {
          currency: 'GBP',
          amount: data.depositAmount,
        },
      },
      {
        onSuccess: () => {
          enqueueSnackbar(
            <Stack direction={'row'} alignItems={'center'} spacing={2}>
              <CheckCircleIcon color={'success'} />
              <Box>
                <Typography fontSize={'14px'} fontWeight={400}>
                  Your deposit request for “{goal?.goalDescription}” is
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
    return;
  });

  return (
    <>
      {isCreatingPayment && show()}
      <FormProvider {...methods}>
        <Form
          id="deposit-form"
          data-testid={'deposit-form'}
          onSubmit={onSubmit}
        >
          <Stack spacing={2.2}>
            <Stack component={Paper} p={2} spacing={0.5} elevation={2}>
              <DepositAmountField />
              <Typography variant={'caption'} color={'#7A7A7A'}>
                Please make sure there are enough funds in your linked bank
                account on the payment date. We cannot process the payment with
                insufficient funds.
              </Typography>
            </Stack>

            <PaymentTransferCard title={'Transfer from'} />

            <Stack direction="row" spacing={2}>
              <Button
                variant={'outlined'}
                sx={{ flexGrow: 1 }}
                onClick={() => navigate(-1)}
                disabled={isCreatingPayment}
              >
                Cancel
              </Button>
              <Button
                type={'submit'}
                sx={{ flexGrow: 1 }}
                isLoading={
                  isCreatingPayment ||
                  isDirectDebitsLoading ||
                  isLoadingGoal ||
                  !!isFetchingBankAccount
                }
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </Form>
      </FormProvider>
    </>
  );
}

export default DepositForm;
