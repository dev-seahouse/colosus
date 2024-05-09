import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectUpdateGoalData } from '@bambu/go-core';
import type { GoalType } from '@bambu/go-core';

const NAVIGATION: Record<GoalType, string> = {
  House: '/house/down-payment',
  Education: '/education/fee',
  'Growing Wealth': '/grow-my-wealth/timeframe',
  Other: '/other-goal/name',
  Retirement: '/retirement/age',
};

/**
 * hook to update selected goal type & navigate to specific goal page
 */
export function useSelectGoal() {
  const reactRouterNavigate = useNavigate();
  const updateGoalData = useSelectUpdateGoalData();

  const navigate = useCallback(
    (goalType: GoalType) => {
      updateGoalData({ goalType });
      reactRouterNavigate(NAVIGATION[goalType] ?? '');
    },
    [reactRouterNavigate, updateGoalData]
  );

  return navigate;
}

export default useSelectGoal;
