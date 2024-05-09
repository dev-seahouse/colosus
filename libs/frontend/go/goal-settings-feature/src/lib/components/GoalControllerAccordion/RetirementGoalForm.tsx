import { Stack, Form, Button } from '@bambu/react-ui';
import { FormProvider, useForm } from 'react-hook-form';
import {
  useSelectInitialInvestment,
  useSelectMonthlyContribution,
} from '@bambu/go-core';

import RetirementAgeField from '../RetirementAgeForm/RetirementAgeField';
import RetirementMonthlyExpensesField from '../RetirementMonthlyExpensesForm/RetirementMonthlyExpensesField';
import InitialDepositField from './InitialDepositField';
import RecurringDepositField from './RecurringDepositField';
import {
  useSelectRetirementAge,
  useSelectRetirementMonthlyExpenses,
} from '../../store/useGoalSettingsStore.selectors';
import GoalSettingsFormAction from '../../layouts/GoalSettingsFormAction/GoalSettingsFormAction';

export const RetirementGoalForm = () => {
  const retirementAge = useSelectRetirementAge();
  const monthlyExpenses = useSelectRetirementMonthlyExpenses();
  const initialInvestment = useSelectInitialInvestment() ?? 0;
  const monthlyContribution = useSelectMonthlyContribution() ?? 0;
  const methods = useForm({
    defaultValues: {
      retirementAge,
      monthlyExpenses,
      initialInvestment,
      monthlyContribution,
    },
  });

  return (
    <FormProvider {...methods}>
      <Form>
        <Stack spacing={2}>
          <RetirementAgeField />
          <RetirementMonthlyExpensesField label="Current monthly expenses" />
          <InitialDepositField />
          <RecurringDepositField />
          <GoalSettingsFormAction>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={() => methods.reset()}
            >
              Cancel
            </Button>
            <Button type="submit" fullWidth>
              Save
            </Button>
          </GoalSettingsFormAction>
        </Stack>
      </Form>
    </FormProvider>
  );
};

export default RetirementGoalForm;
