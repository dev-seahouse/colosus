import { DateTime } from 'luxon';
import {
  useSelectGoalName,
  useSelectGoalTimeframe,
  useSelectGoalType,
  useSelectGoalValue,
  useSelectInitialInvestment,
  useSelectMonthlyContribution,
} from '@bambu/go-core';

export const useSelectPaymentSettingsState = () => {
  return {
    goalName: useSelectGoalName(),
    goalType: useSelectGoalType(),
    goalValue: useSelectGoalValue(),
    goalTimeframe: useSelectGoalTimeframe(),
    initialDeposit: useSelectInitialInvestment(),
    recurringDeposit: useSelectMonthlyContribution(),
    ...getGoalStartEndDates(useSelectGoalTimeframe()),
  };
};

export function getGoalStartEndDates(goalTimeFrame: number) {
  // return yyyy/mm
  return {
    startDate: DateTime.now().toFormat('yyyy/MM'),
    endDate: DateTime.now().plus({ months: goalTimeFrame }).toFormat('yyyy/MM'),
  };
}

export default useSelectPaymentSettingsState;
