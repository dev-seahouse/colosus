import type { TabPanelProps } from '../TabPanel/TabPanel';
import TabPanel from '../TabPanel/TabPanel';
import {
  SkeletonLoading,
  useGetInvestorGoalDetails,
  useSelectModelPortfolioById,
} from '@bambu/go-core';
import { Card, CardContent, ErrorLoadingData, Stack } from '@bambu/react-ui';
import { AssetAllocationPieChart } from '@bambu/go-goal-settings-feature';
import PortfolioDetails from '../PortfolioDetails/PortfolioDetails';

export function GoalDetailsTabsProductsPanel({
  index,
  value,
  tabsName,
  goalId,
}: TabPanelProps & { goalId: string | undefined }) {
  const {
    data: goal,
    isLoading: isGoalLoading,
    isError: isGoalError,
    isSuccess: isGoalSuccess,
  } = useGetInvestorGoalDetails(
    { goalId: goalId ?? '' },
    { enabled: !!goalId }
  );

  const modelPortfolioId = goal?.computedRiskProfile?.riskAppetite as
    | string
    | undefined;

  const {
    data: modelPortfolio,
    isLoading: isModelPortfolioLoading,
    isError: isModelPortfolioError,
  } = useSelectModelPortfolioById({
    id: modelPortfolioId,
    enabled: typeof modelPortfolioId === 'string',
  });

  if (!goalId) {
    // when user enters the route without goalId queryString
    console.error('GoalDetailsTabsProductsPanel: goalId is not found');
    return <ErrorLoadingData />;
  }

  if (isModelPortfolioLoading || isGoalLoading) {
    return <SkeletonLoading variant={'small'} />;
  }

  if (isGoalError) {
    // when profile api is down , the rest is skipped
    console.error('GoalDetailsTabsProductsPanel: profile api error');
    return <ErrorLoadingData />;
  }

  if (isGoalSuccess && !goal) {
    // when profile is loaded but goal is not found based on the queryString goalId
    console.error(
      'GoalDetailsTabsProductsPanel: goal is not found based goalId'
    );
    return <ErrorLoadingData />;
  }

  if (isGoalSuccess && !modelPortfolioId) {
    // when profile loads but computedRiskProfile does not have riskAppetite
    console.error(
      "GoalDetailsTabsProductsPanel:no modelPortfolio is found matching the goal's computedRiskProfile modelPortfolioId"
    );
    return <ErrorLoadingData />;
  }

  if (isModelPortfolioError) {
    // when modelPortfolio api is down
    console.error('GoalDetailsTabsProductsPanel: modelPortfolio api error');
    return <ErrorLoadingData />;
  }

  if (!isGoalSuccess && !modelPortfolioId) {
    // when goal is not loading but computedRiskProfile does not have riskAppetite
    console.error(
      'GoalDetailsTabsProductsPanel: modelPortfolio id is not found'
    );
    return <ErrorLoadingData />;
  }

  return (
    <TabPanel index={index} value={value} tabsName={tabsName}>
      <Stack spacing={3}>
        <Card elevation={2}>
          <CardContent>
            {isGoalLoading || isModelPortfolioLoading ? (
              <SkeletonLoading variant={'small'} />
            ) : (
              <AssetAllocationPieChart
                data={modelPortfolio?.assetClassAllocation || []}
                variant="square"
              />
            )}
          </CardContent>
        </Card>
        <PortfolioDetails />
      </Stack>
    </TabPanel>
  );
}

export default GoalDetailsTabsProductsPanel;
