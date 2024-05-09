import GoalSettingsFormAction from '../../layouts/GoalSettingsFormAction/GoalSettingsFormAction';
import { BackButton, Button } from '@bambu/react-ui';
import { useFormContext } from 'react-hook-form';

import { useSelectAge } from '@bambu/go-core';
import type { RetirementGoalAmountProps } from './RetirementMonthlyExpensesForm';

import type { RetirementMonthlyExpensesFormState } from './RetirementMonthlyExpensesForm';
import {
  useSelectRetirementAge,
  useSelectSubmitRetirementGoal,
} from '../../store/useGoalSettingsStore.selectors';
import { useNavigate } from 'react-router-dom';

export interface RetirementMonthlyExpensesAction
  extends RetirementGoalAmountProps {
  isLoading?: boolean;
}
export function RetirementMonthlyExpensesAction({
  goalValue,
  isLoading = false,
}: RetirementMonthlyExpensesAction) {
  const { handleSubmit, getValues } =
    useFormContext<RetirementMonthlyExpensesFormState>();

  const submitRetirementGoal = useSelectSubmitRetirementGoal();
  const age = useSelectAge() as number;
  const retirementAge = useSelectRetirementAge() as number;

  const navigate = useNavigate();
  const monthlyExpenses = getValues('monthlyExpenses');

  const onSubmit = handleSubmit(() => {
    submitRetirementGoal({
      retirementAge,
      age,
      monthlyExpenses,
      goalValue,
    });
    navigate('../investment-style');
  });

  return (
    <GoalSettingsFormAction>
      <BackButton
        fullWidth
        variant="outlined"
        startIcon={null}
        color="primary"
        disabled={isLoading}
      />
      <Button
        fullWidth
        type="submit"
        onClick={onSubmit}
        variant="contained"
        disabled={isLoading}
      >
        Next
      </Button>
    </GoalSettingsFormAction>
  );
}

export default RetirementMonthlyExpensesAction;
