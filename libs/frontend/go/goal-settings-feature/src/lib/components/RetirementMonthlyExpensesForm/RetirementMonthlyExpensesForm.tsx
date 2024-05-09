import { useState, useMemo, useEffect } from 'react';
import { Stack, Form, useMobileView, Box } from '@bambu/react-ui';

import { useForm, FormProvider } from 'react-hook-form';
import { BottomAction, useSelectSetProgress } from '@bambu/go-core';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import RetirementMonthlyExpensesIcon from '../icons/ExpenseIcon/ExpenseIcon';
import RetirementMonthlyExpensesAction from './RetirementMonthlyExpensesAction';
import {
  CalculateRetirementGoalAmountRequestGender,
  CalculateRetirementGoalAmountRequestPeriod,
} from '@bambu/api-client';
import GoalSettingsFormHeader from '../../layouts/GoalSettingsFormHeader/GoalSettingsFormHeader';
import { useSelectAge } from '@bambu/go-core';
import RetirementMonthlyExpenseBanner from './RetirementMonthlyExpenseBanner';
import { useSelectRetirementMonthlyExpenses } from '../../store/useGoalSettingsStore.selectors';
import { useSelectGoalValue } from '@bambu/go-core';

import RetirementMonthlyExpensesField from './RetirementMonthlyExpensesField';
import useCalculateRetirementGoalAmount from '../../hooks/useCalculateRetirementGoalAmount/useCalculateRetirementGoalAmount';
import { useDebounce } from '../../hooks/useDebounce/useDebounce';
import { useSelectLifeExpectancyAndInterestQuery } from '../../hooks/useGetCountryRate/useGetCountryRate.selectors';
import { useSelectRetirementAge } from '../../store/useGoalSettingsStore.selectors';

const retirementMonthlyExpensesFormSchema = z
  .object({
    monthlyExpenses: z
      .number({ required_error: 'Your monthly expenses must be $1 or higher' })
      .min(1, 'Your monthly expenses must be $1 or higher'),
  })
  .required();

export type RetirementMonthlyExpensesFormState = z.infer<
  typeof retirementMonthlyExpensesFormSchema
>;

export interface RetirementGoalAmountProps {
  goalValue: number;
}

export function RetirementMonthlyExpensesForm() {
  const monthlyExpenses = useSelectRetirementMonthlyExpenses();
  const retirementGoalValue = useSelectGoalValue();

  const [calculatedRetirementGoalValue, setRetirementGoalValue] =
    useState<number>(retirementGoalValue ?? 0);

  const isMobileView = useMobileView();
  const { data: lifeExpectancyAndInterest } =
    useSelectLifeExpectancyAndInterestQuery();
  const age = useSelectAge() ?? 0;
  const retirementAge = useSelectRetirementAge() ?? 0;
  const setProgress = useSelectSetProgress();
  const methods = useForm<RetirementMonthlyExpensesFormState>({
    resolver: zodResolver(retirementMonthlyExpensesFormSchema),
    mode: 'onTouched',
    defaultValues: {
      monthlyExpenses,
    },
  });

  const inputExpense = useDebounce(methods.watch('monthlyExpenses'));

  // TODO relocate the constant payloads into query hook
  const debouncePayload = useMemo(
    () => ({
      retirementAge,
      // to make sure the life expectancy is at least 81
      lifeExpectancyMale: Math.max(
        lifeExpectancyAndInterest?.lifeExpectancyMale ?? 76,
        81
      ),
      // to make sure the life expectancy is at least 81
      lifeExpectancyFemale: Math.max(
        lifeExpectancyAndInterest?.lifeExpectancyFemale ?? 81,
        81
      ),
      gender: CalculateRetirementGoalAmountRequestGender.MALE,
      period: CalculateRetirementGoalAmountRequestPeriod.END,
      country: 'US',
      compoundsPerYear: 1,
      annualRetirementIncome: inputExpense * 12,
      age,
      annualisedSavingsAcctIntR:
        lifeExpectancyAndInterest?.annualisedSavingsAcctIntR ?? 0.02,
      annualisedInflationRate:
        lifeExpectancyAndInterest?.annualisedInflationRate ?? 0.017,
      additionalSource: {
        retirementSavings: 0,
        colaRate: 0,
        pension: 0,
        socialSecurityBenefit: 0,
      },
      calculateTax: true,
    }),
    [
      inputExpense,
      age,
      lifeExpectancyAndInterest?.annualisedInflationRate,
      lifeExpectancyAndInterest?.annualisedSavingsAcctIntR,
      lifeExpectancyAndInterest?.lifeExpectancyFemale,
      lifeExpectancyAndInterest?.lifeExpectancyMale,
      retirementAge,
    ]
  );

  // Wip animation pending design
  const { data, isLoading } = useCalculateRetirementGoalAmount({
    enabled: !!inputExpense,
    args: debouncePayload,
  });

  useEffect(() => {
    setProgress(10);
  }, [setProgress]);

  useEffect(() => {
    if (data?.goalAmount) setRetirementGoalValue(data.goalAmount);
  }, [data?.goalAmount]);

  return (
    <FormProvider {...methods}>
      <Form
        id="retirement-monthly-expenses-form"
        data-testid="retirement-monthly-expenses-form"
      >
        <Stack spacing={8}>
          <Stack spacing={2}>
            <GoalSettingsFormHeader
              Icon={RetirementMonthlyExpensesIcon}
              title="How much are your current monthly expenses?"
            />
            <RetirementMonthlyExpensesField helperText="We'll use this to calculate how much you should save for your retirement" />
            {calculatedRetirementGoalValue && inputExpense ? (
              <RetirementMonthlyExpenseBanner
                goalValue={calculatedRetirementGoalValue}
              />
            ) : null}
            {isMobileView && (
              <BottomAction>
                <RetirementMonthlyExpensesAction
                  goalValue={calculatedRetirementGoalValue}
                  isLoading={isLoading}
                />
              </BottomAction>
            )}
          </Stack>
          {!isMobileView && (
            <Box display="flex" justifyContent="space-around">
              <RetirementMonthlyExpensesAction
                goalValue={calculatedRetirementGoalValue}
                isLoading={isLoading}
              />
            </Box>
          )}
        </Stack>
      </Form>
    </FormProvider>
  );
}

export default RetirementMonthlyExpensesForm;
