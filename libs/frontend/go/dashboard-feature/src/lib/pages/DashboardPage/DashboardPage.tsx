import {
  GoAppLayout,
  SkeletonLoading,
  useGetGoalsForTenantInvestor,
} from '@bambu/go-core';
import { Container, Stack } from '@bambu/react-ui';
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout';
import DashboardBanner from '../../components/DashboardBanner/DashboardBanner';
import ExploreOtherGoals from '../../components/ExploreOtherGoals/ExploreOtherGoals';
import { GoalCard } from '../../components/GoalCard/GoalCard';
import { useFeatureFlag } from '@harnessio/ff-react-client-sdk';

export function DashboardPage() {
  const {
    data: goals,
    isLoading: isGoalsLoading,
    isFetching: isFetchingGoals,
  } = useGetGoalsForTenantInvestor(
    {
      pageSize: 50,
      pageIndex: 0,
    },
    {
      refetchOnMount: true, // do not turn this off
    }
  );
  const isExploreOtherGoalsEnabled = useFeatureFlag(
    'feature_explore_othergoals'
  );
  /**
   *  -portfolio value,
   *  -cumulative return,
   *  -goal start/end date
   *  are null before goal is funded (creates payment)
   */

  return (
    <GoAppLayout>
      <DashboardLayout>
        <Container sx={{ '&&': { px: [1.8], mt: [3] } }}>
          <Stack spacing={3}>
            <DashboardBanner />
            {isGoalsLoading || isFetchingGoals ? (
              <SkeletonLoading />
            ) : (
              goals?.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goalId={goal.id}
                  goalEndDateISO={goal.goalEndDate as unknown as string}
                  goalStatus={goal.status}
                  goalTimeframe={goal.goalTimeframe}
                  goalTitle={goal.goalName}
                  goalValue={goal.goalValue}
                  portfolioValue={0}
                  cumulativeReturn={0}
                  recurringDeposit={goal.GoalRecurringSavingsPlans[0].amount}
                />
              ))
            )}

            {isExploreOtherGoalsEnabled ? <ExploreOtherGoals /> : null}
          </Stack>
        </Container>
      </DashboardLayout>
    </GoAppLayout>
  );
}

export default DashboardPage;
