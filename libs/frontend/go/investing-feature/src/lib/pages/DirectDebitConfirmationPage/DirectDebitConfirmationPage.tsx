import {
  getDirectDebitMandatesQuery,
  GoAppLayout,
  hasActiveDirectDebitMandates,
  hasBankAccounts,
  hasPendingMandates,
  useAppBar,
  useGetBankAccountsPaged,
  useGetDirectDebitMandates,
} from '@bambu/go-core';
import {
  Box,
  Button,
  Container,
  enqueueSnackbar,
  Stack,
  Typography,
} from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';
import { useReducer } from 'react';
import WealthKernelContactInfoDialog from '../../components/WealthKernelContactInfoDialog/WealthKernelContactInfoDialog';
import DirectDebitConfirmBankDetailsCallout from '../../components/DirectDebitConfirmBankDetailsCallout/DirectDebitConfirmBankDetailsCallout';
import DirectDebitConfirmationPdfCallout from '../../components/DirectDebitConfirmationPdfCallout/DirectDebitConfirmationPdfCallout';
import DirectDebitConfirmDisclaimer from '../../components/DirectDebitConfirmDisclaimer/DirectDebitConfirmDisclaimer';
import useCreateDirectDebitMandate from '../../hooks/useCreateDirectDebitMandate/useCreateDirectDebitMandate';
import DirectDebitConfirmationSuccessSnackBar from '../../components/DirectDebitConfirmationSuccessSnackBar/DirectDebitConfirmationSuccessSnackBar';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import type { InvestorBrokerageDirectDebitMandateItem } from '@bambu/api-client';
import { InvestorBrokerUkDirectDebitMandateStatusEnum } from '@bambu/api-client';
import useCancelDirectDebitMandate from '../../hooks/useCancelDirectDebitMandate/useCancelDirectDebitMandate';

export function DirectDebitConfirmationPage() {
  const queryClient = useQueryClient();
  const { show } = useAppBar();
  const navigate = useNavigate();
  const [isWpContactInfoDialogOpen, toggleWpContactInfoDialogOpen] = useReducer(
    (state) => !state,
    false
  );
  const { data: existingMandates, isLoading: isLoadingExistingMandates } =
    useGetDirectDebitMandates();
  const { data: bankAccounts, isLoading: isLoadingBankAccounts } =
    useGetBankAccountsPaged({ limit: 1 });
  const {
    mutate: createNewDirectDebitMandate,
    isLoading: isCreatingDirectMandate,
  } = useCreateDirectDebitMandate();
  const {
    mutate: cancelExistingMandate,
    isLoading: isCancellingExistingMandate,
  } = useCancelDirectDebitMandate();

  const isFetchingPdf = useIsFetching(['getDirectDebitMandatePdfPreview']);

  function handleAcceptDirectDebitMandate() {
    if (hasActiveDirectDebitMandates(existingMandates)) {
      const currentActiveMandate = getCurrentActiveMandate(existingMandates);
      cancelAndShowToast(currentActiveMandate);
    }

    if (hasBankAccounts(bankAccounts?.results)) {
      createNewDirectDebitMandateAndShowToast();
      return;
    }

    enqueueSnackbar('No bank account found.', {
      variant: 'error',
      anchorOrigin: { vertical: 'top', horizontal: 'center' },
    });
  }

  function cancelAndShowToast(
    currentActiveMandate: InvestorBrokerageDirectDebitMandateItem
  ) {
    cancelExistingMandate(
      { mandateId: currentActiveMandate?.id ?? '' },
      {
        onError: () => {
          enqueueSnackbar('Error cancelling existing active mandate', {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
          });
        },
        onSuccess: () => {
          enqueueSnackbar('successfully cancelled existing active mandate', {
            variant: 'success',
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
          });
        },
      }
    );
  }
  function createNewDirectDebitMandateAndShowToast() {
    createNewDirectDebitMandate(
      {
        bankAccountId: bankAccounts?.results?.[0]?.id ?? '',
        partyId: bankAccounts?.results?.[0]?.partyId ?? '',
      },
      {
        onSuccess: (data) => {
          if (
            data.status === InvestorBrokerUkDirectDebitMandateStatusEnum.FAILED
          ) {
            enqueueSnackbar(data.reason, {
              variant: 'error',
              anchorOrigin: { vertical: 'top', horizontal: 'center' },
            });
            return;
          }
          enqueueSnackbar(
            <DirectDebitConfirmationSuccessSnackBar
              onClick={() => window.open('https://gocardless.com', '_blank')}
            />,
            {
              variant: 'long_success',
              anchorOrigin: { vertical: 'top', horizontal: 'center' },
            }
          );
          queryClient.invalidateQueries(getDirectDebitMandatesQuery);
          navigate({
            pathname: `/dashboard`,
          });
        },
        onError: () => {
          enqueueSnackbar('Error setting up direct debit mandate', {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
          });
        },
      }
    );
  }

  return (
    <GoAppLayout>
      <Container>
        {isCreatingDirectMandate && show()}
        <Stack spacing={2} sx={{ pb: 5 }}>
          <Typography component={'h1'} fontWeight={'bold'} fontSize={'22px'}>
            Please check the details below
          </Typography>
          <Box sx={{ pb: 0.5 }}>
            <Typography>
              Below are the details we will use to set up your Direct Debit
              mandate. Please check that the details are all correct.
            </Typography>
          </Box>
          <DirectDebitConfirmBankDetailsCallout />
          <DirectDebitConfirmationPdfCallout
            toggleWpContactInfoDialogOpen={toggleWpContactInfoDialogOpen}
          />
          <DirectDebitConfirmDisclaimer
            onClick={toggleWpContactInfoDialogOpen}
          />

          <WealthKernelContactInfoDialog
            onClose={toggleWpContactInfoDialogOpen}
            open={isWpContactInfoDialogOpen}
          />

          <Stack gap={'10px'} direction={['column', 'row']}>
            <Button
              fullWidth
              type={'submit'}
              disabled={
                isLoadingExistingMandates ||
                isCreatingDirectMandate ||
                isLoadingBankAccounts ||
                isCancellingExistingMandate ||
                isFetchingPdf > 0
              }
              onClick={handleAcceptDirectDebitMandate}
              isLoading={isCreatingDirectMandate || isLoadingBankAccounts}
            >
              Accept Direct Debit mandate
            </Button>
            <Button
              fullWidth
              disabled={
                isLoadingExistingMandates ||
                isCreatingDirectMandate ||
                isLoadingBankAccounts ||
                isCancellingExistingMandate
              }
              variant={'outlined'}
              onClick={() => {
                if (hasPendingMandates(existingMandates)) {
                  alert(
                    'You have one or more pending mandate, please wait for it to be completed'
                  );
                  return;
                }

                if (hasActiveDirectDebitMandates(existingMandates)) {
                  alert(
                    'You have one or more active mandate, please note that your previous Direct Debit mandate will be cancelled when you proceed with this one.'
                  );
                }
                navigate({
                  pathname: `/direct-debit-mandate-setup`,
                });
              }}
            >
              Change
            </Button>
          </Stack>
        </Stack>
      </Container>
    </GoAppLayout>
  );
}

function getCurrentActiveMandate(
  existingMandates: Array<InvestorBrokerageDirectDebitMandateItem>
): InvestorBrokerageDirectDebitMandateItem {
  return existingMandates.find(
    (m) => m.status === InvestorBrokerUkDirectDebitMandateStatusEnum.ACTIVE
  ) as InvestorBrokerageDirectDebitMandateItem;
}

export default DirectDebitConfirmationPage;
