import { z } from 'zod';
import { ErrorLoadingData, Form, Stack } from '@bambu/react-ui';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import GoalSettingsFormHeader from '../../layouts/GoalSettingsFormHeader/GoalSettingsFormHeader';
import ExpenseIcon from '../icons/ExpenseIcon/ExpenseIcon';
import SetupContributionAction from '../SetupContributionAction/SetupContributionAction';
import SetupContributionRecommendation from '../SetupContributionRecommendation/SetupContributionRecommendation';
import { useDebounce } from '../../hooks/useDebounce/useDebounce';
import { RecurringDepositField } from './RecurringDepositField';
import { InitialDepositField } from './InitialDepositField';
import {
  GoalTypeEnum,
  useSelectGoalType,
  useSelectInitialInvestment,
  useSelectMonthlyContribution,
  useSelectMonthlySavings,
} from '@bambu/go-core';
import type { GetContributionRecommendationData } from '../../hooks/useGetContributionRecommendation/useGetContributionRecommendation';
import useGetContributionRecommendation from '../../hooks/useGetContributionRecommendation/useGetContributionRecommendation';
import {
  MIN_INITIAL_DEPOSIT,
  MIN_INITIAL_DEPOSIT_MSG,
  MIN_RECURRING_DEPOSIT,
  MIN_RECURRING_DEPOSIT_MSG,
} from './SetupRecommendationForm.definition';

const setupContributionSchema = z.object({
  initialDeposit: z
    .number({
      required_error: MIN_INITIAL_DEPOSIT_MSG,
    })
    .min(MIN_INITIAL_DEPOSIT, MIN_INITIAL_DEPOSIT_MSG),
  recurringDeposit: z
    .number({ required_error: MIN_RECURRING_DEPOSIT_MSG })
    .optional()
    .refine((value) => {
      if (value == null) return true;
      return value === 0 || value > MIN_RECURRING_DEPOSIT - 1;
    }, MIN_RECURRING_DEPOSIT_MSG),
});

export type SetupContributionFormState = z.infer<
  typeof setupContributionSchema
>;

/** SetupContribution form */
interface SetupContributionFormProps {
  initialData?: {
    contributionRecommendation: GetContributionRecommendationData;
  };
}

export function SetupContributionForm({
  initialData,
}: SetupContributionFormProps) {
  const monthlySavings = useSelectMonthlySavings() ?? 0;
  const initialDepositDefaultVal = useSelectInitialInvestment() ?? undefined;
  const recurringDepositDefaultVal =
    useSelectMonthlyContribution() ?? undefined;
  // const recurringDeposit = useSelectMonthlySavings(); //pending merge
  const goalType = useSelectGoalType();
  const methods = useForm<SetupContributionFormState>({
    mode: 'onTouched',
    resolver: zodResolver(setupContributionSchema),
    defaultValues: {
      initialDeposit: initialDepositDefaultVal,
      recurringDeposit: recurringDepositDefaultVal, //
    },
  });

  const debouncedInitialDepositInput = useDebounce(
    methods.watch('initialDeposit'),
    500
  );
  const debouncedRSPInput = useDebounce(methods.watch('recurringDeposit'), 500);
  const showRecommendation = goalType !== GoalTypeEnum['Growing Wealth'];
  const { data, isLoading, isError, error } = useGetContributionRecommendation({
    ...(initialData?.contributionRecommendation ?? {
      initialData: initialData?.contributionRecommendation,
    }),
    args: {
      inputInitialInvestment: debouncedInitialDepositInput,
      inputMonthlyContribution: (debouncedRSPInput ?? 0) * 12,
    },
    enabled: showRecommendation,
  });

  if (error) {
    console.error(error);
  }

  return (
    <FormProvider {...methods}>
      <Form id="setup-contribution-form" data-testid="setup-contribution-form">
        <Stack spacing={8}>
          <Stack spacing={2}>
            <GoalSettingsFormHeader
              Icon={ExpenseIcon}
              title="How much would you like to invest for this goal?"
            />

            <InitialDepositField />
            <RecurringDepositField />

            {showRecommendation && !isError ? (
              <SetupContributionRecommendation
                monthlySavings={monthlySavings}
                userInputRSP={debouncedRSPInput}
                hasError={isError}
                recommendedRSP={Math.ceil(
                  (data?.recommendations?.constantInfusion?.[0] ?? 0) / 12
                )}
                isLoading={isLoading}
              />
            ) : null}
            {isError && <ErrorLoadingData />}
            <SetupContributionAction />
          </Stack>
        </Stack>
      </Form>
    </FormProvider>
  );
}

export default SetupContributionForm;
