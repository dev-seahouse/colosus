import type { GoalType } from '@bambu/go-core';
import { GoalTypeEnum } from '@bambu/go-core';

const PAYMENT_PLAN_NAMES = {
  [GoalTypeEnum.Education]: 'Save for college fees plan',
  [GoalTypeEnum.House]: 'Buy a house plan',
  [GoalTypeEnum.Retirement]: 'Retire comfortably plan',
  [GoalTypeEnum['Growing Wealth']]: 'Grow my wealth plan',
};

export function getPaymentPlanName(
  goalType: GoalType | null,
  goalName: string | null
) {
  if (goalType == null) {
    throw new Error('Goal type is empty.');
  }

  if (goalName == null) {
    throw new Error('goal name is empty');
  }

  if (goalType === GoalTypeEnum.Other) {
    return goalName + ' ' + 'plan';
  }

  if (!PAYMENT_PLAN_NAMES[goalType]) {
    throw new Error('invalid goalType');
  }

  return PAYMENT_PLAN_NAMES[goalType];
}
