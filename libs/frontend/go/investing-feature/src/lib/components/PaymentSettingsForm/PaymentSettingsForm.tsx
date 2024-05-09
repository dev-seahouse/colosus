import { Box, Button, Form, Stack, enqueueSnackbar } from '@bambu/react-ui';
import PaymentSettingsGoalCard from '../PaymentSettingsGoalCard/PaymentSettingsGoalCard';
import PaymentSettingsContributionDetailsCard from '../PaymentSettingsContributionDetailsCard/PaymentSettingsContributionDetailsCard';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ErrorLoadingCard,
  getActiveMandate,
  PaymentTransferCard,
  useAppBar,
  useCreateDirectDebitPayment,
  useGetBankAccountById,
  useGetDirectDebitMandates,
  useGetInvestorGoalDetails,
} from '@bambu/go-core';
import useCreateDirectDebitSubscription from '../../hooks/useCreateDirectDebitSubscription/useCreateDirectDebitSubscription';
import type { InvestorGetGoalDetailsApiResponseDto } from '@bambu/api-client';
import { InvestorBrokerageUkDirectDebitSubscriptionIntervalEnum } from '@bambu/api-client';
import { useState } from 'react';
import TransactionInProgressSnackBar from '../TransactionInProgressSnackBar/TransactionInProgressSnackBar';
import { PaymentSettingsMaxDailyLimitDialog } from '@bambu/go-manage-goals-feature';

const getPaymentSettingsSchema = (rspValue: number | undefined) =>
  z.object({
    recurringPaymentDate:
      rspValue === 0
        ? z.number().optional()
        : z.number({ required_error: 'Recurring payment date is required' }),
  });

export type PaymentSettingsFormValues = z.infer<
  ReturnType<typeof getPaymentSettingsSchema>
>;

export function PaymentSettingsForm() {
  const { show } = useAppBar();
  const { goalId } = useParams();
  const [
    isPaymentSettingsMaxDailyLimitModalOpen,
    setPaymentSettingsMaxDailyLimitModalOpen,
  ] = useState(false);
  const navigate = useNavigate();
  const { data: goal, isLoading: isLoadingGoal } = useGetInvestorGoalDetails(
    { goalId: goalId ?? '' },
    { enabled: !!goalId }
  );
  const { data: directDebitMandates, isLoading: isDirectDebitsLoading } =
    useGetDirectDebitMandates();
  const activeMandate = getActiveMandate(directDebitMandates);
  const { data: bankAccount } = useGetBankAccountById(
    { bankAccountId: activeMandate?.bankAccountId ?? '' },
    { enabled: activeMandate?.bankAccountId != null }
  );
  const createPayment = useCreateDirectDebitPayment();
  const createSubscription = useCreateDirectDebitSubscription();

  const methods = useForm<PaymentSettingsFormValues>({
    mode: 'onTouched',
    resolver: zodResolver(
      getPaymentSettingsSchema(goal?.GoalRecurringSavingsPlans?.[0]?.amount)
    ),
  });

  if (!goalId) {
    console.error('Goal id is required');
    return <ErrorLoadingCard />;
  }

  function submitPayment(amount: number) {
    createPayment.mutate(
      {
        mandateId: activeMandate?.id ?? '',
        goalId: goalId ?? '',
        amount: {
          currency: 'GBP',
          amount: amount,
        },
      },
      {
        onSuccess: () => {
          if (!goal?.GoalRecurringSavingsPlans?.length) {
            enqueueSnackbar(<TransactionInProgressSnackBar goal={goal} />, {
              variant: 'long_success',
              anchorOrigin: { vertical: 'top', horizontal: 'center' },
            });
            navigate('/dashboard');
          }
        },
        onError: () => {
          enqueueSnackbar('Error creating recurring deposit', {
            variant: 'error',
          });
        },
      }
    );
  }

  function submitSubscriptionRequest(amount: number) {
    const data = methods.getValues();
    createSubscription.mutate(
      {
        mandateId: activeMandate?.id ?? '',
        goalId: goalId ?? '',
        amount: {
          currency: 'GBP',
          amount: amount,
        },
        interval:
          InvestorBrokerageUkDirectDebitSubscriptionIntervalEnum.MONTHYL,
        dayOfMonth: data.recurringPaymentDate,
      },
      {
        onSuccess: () => {
          enqueueSnackbar(<TransactionInProgressSnackBar goal={goal} />, {
            variant: 'long_success',
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
          });
          navigate('/dashboard');
        },
        onError: () => {
          enqueueSnackbar('Error creating initial deposit', {
            variant: 'error',
          });
        },
      }
    );
  }

  const handleSubmit = methods.handleSubmit((data) => {
    if (!activeMandate) {
      enqueueSnackbar('Please setup direct debit', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
      navigate(`/direct-debit-mandate-setup`);
      return;
    }

    if (isGoalRecurringSavingsPlanAmountGreaterThanMaxDailyLimit(goal)) {
      setPaymentSettingsMaxDailyLimitModalOpen(true);
      return;
    }

    submitPayment(goal?.initialInvestment ?? 0);

    if (goal?.GoalRecurringSavingsPlans?.length) {
      submitSubscriptionRequest(goal?.GoalRecurringSavingsPlans?.[0]?.amount);
    }
  });

  function isGoalRecurringSavingsPlanAmountGreaterThanMaxDailyLimit(
    goal: InvestorGetGoalDetailsApiResponseDto | undefined
  ) {
    if (!goal) return false;
    if (!Array.isArray(goal?.GoalRecurringSavingsPlans)) return false;
    if (goal?.GoalRecurringSavingsPlans?.[0]?.amount === 0) return false;
    if (goal?.GoalRecurringSavingsPlans?.[0]?.amount > 2000) return true;
    return goal?.initialInvestment > 2000;
  }

  function onPaymentLimitModalYesClick() {
    const clamp = (num: number, min: number, max: number) =>
      Math.min(Math.max(num, min), max);

    submitPayment(clamp(goal?.initialInvestment ?? 0, 0, 2000));

    if (goal?.GoalRecurringSavingsPlans?.length) {
      submitSubscriptionRequest(
        clamp(goal?.GoalRecurringSavingsPlans?.[0]?.amount, 0, 2000)
      );
    }
  }

  return (
    <>
      {(createPayment.isLoading || createSubscription.isLoading) && show()}
      <FormProvider {...methods}>
        <Form
          onSubmit={handleSubmit}
          id={'payment-settings-form'}
          data-testid={'payment-settings-form'}
        >
          <Stack spacing={2.2}>
            <PaymentSettingsGoalCard />
            <PaymentSettingsContributionDetailsCard />
            <PaymentTransferCard />
            <PaymentSettingsMaxDailyLimitDialog
              onOkClick={onPaymentLimitModalYesClick}
              disabled={
                !activeMandate ||
                !bankAccount ||
                isDirectDebitsLoading ||
                isLoadingGoal
              }
              isCancelDisabled={
                createPayment.isLoading || createSubscription.isLoading
              }
              isLoading={
                isDirectDebitsLoading ||
                isLoadingGoal ||
                createPayment.isLoading ||
                createSubscription.isLoading
              }
              onCancelClick={() =>
                setPaymentSettingsMaxDailyLimitModalOpen(false)
              }
              open={isPaymentSettingsMaxDailyLimitModalOpen}
            />
            <Box
              sx={{
                py: 2,
                display: 'flex',
                justifyContent: ['center', 'flex-end'],
                gap: '15px',
                position: 'static',
              }}
            >
              <Button
                type="button"
                variant="outlined"
                sx={{ flex: [1, 1, 0] }}
                onClick={() => navigate('/dashboard')}
                disabled={
                  createPayment.isLoading || createSubscription.isLoading
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                sx={{ flex: [1, 1, 0] }}
                isLoading={
                  isDirectDebitsLoading ||
                  isLoadingGoal ||
                  createPayment.isLoading ||
                  createSubscription.isLoading
                }
                disabled={
                  !activeMandate ||
                  !bankAccount ||
                  isDirectDebitsLoading ||
                  isLoadingGoal
                }
              >
                Submit
              </Button>
            </Box>
          </Stack>
        </Form>
      </FormProvider>
    </>
  );
}

export default PaymentSettingsForm;
