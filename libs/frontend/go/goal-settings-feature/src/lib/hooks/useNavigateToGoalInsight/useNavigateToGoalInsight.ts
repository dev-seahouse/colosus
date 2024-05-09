import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeatureFlag } from '@harnessio/ff-react-client-sdk';

/**
 * hook to navigate to goal insight page
 * TODO: rename and refactor this
 */
export function useNavigateToGoalinsight() {
  const reactRouterNavigate = useNavigate();
  const isContributionEnabled = useFeatureFlag('feature_contribution');
  const navigate = useCallback(() => {
    const path = isContributionEnabled
      ? '../setup-contribution'
      : '/goal-insight';

    reactRouterNavigate(path);
  }, [reactRouterNavigate, isContributionEnabled]);

  return navigate;
}

export default useNavigateToGoalinsight;
