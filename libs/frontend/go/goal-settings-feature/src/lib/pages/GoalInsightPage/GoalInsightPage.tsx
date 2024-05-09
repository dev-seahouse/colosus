import {
  ExploreGoal,
  Header,
  useGetAdvisorProfile,
  useSelectAdvisorSubscriptionTypeQuery,
  useSelectCurrentSavings,
  useSelectIncomePerAnnum,
  useSelectIsGoodLeadQuery,
} from '@bambu/go-core';
import { BackButton, Box, Container, Paper, Stack } from '@bambu/react-ui';
import ContactAdvisor from '../../components/ContactAdvisor/ContactAdvisor';
import AdvisorProfile from '../../components/AdvisorProfile/AdvisorProfile';
import InsightLoader from '../../components/InsightLoader/InsightLoader';
import GoalDetails from '../../components/GoalDetails/GoalDetails';
import ProductRecommendationTabs from '../../components/ProductRecommendationTabs/ProductRecommendationTabs';
import type { GetOptimizedProjectionData } from '../../hooks/useGetOptimizedProjection/useGetOptimizedProjection';
import useGetOptimizedProjection from '../../hooks/useGetOptimizedProjection/useGetOptimizedProjection';
import SendFinancialPlanButton from '../../components/SendFinancialPlanButton/SendFinancialPlanButton';
import InvestNowAction from '../../components/InvestNowAction/InvestNowAction';
import GoalProjection from '../../components/GoalProjection/GoalProjection';

export interface GoalInsightPageProps {
  initialData?: {
    projection: GetOptimizedProjectionData;
  };
}

export function GoalInsightPage({ initialData }: GoalInsightPageProps) {
  const { isLoading, isRefetching } = useGetOptimizedProjection({
    ...(initialData?.projection && {
      initialData: initialData?.projection,
    }),
  });
  const {
    data: canPerformTransactActions,
    isLoading: isLoadingAdvisorProfile,
  } = useGetAdvisorProfile({
    select: (data) => data?.canPerformTransactActions,
  });
  const { data: subscriptionType } = useSelectAdvisorSubscriptionTypeQuery();
  const incomePerAnnum = useSelectIncomePerAnnum() ?? 0;
  const annualSavings = useSelectCurrentSavings() ?? 0;
  const { data: isGoodLead } = useSelectIsGoodLeadQuery({
    incomePerAnnum,
    annualSavings,
  });

  if (isLoading || isRefetching || isLoadingAdvisorProfile) {
    return <InsightLoader />;
  }

  return (
    <>
      <Header />
      <Container disableGutters sx={{ '&': { pt: 0, pb: 3 } }}>
        <Box px={4} pt={2.5}>
          <BackButton />
        </Box>
        <Stack spacing={2.5} sx={{ px: 3 }}>
          <GoalDetails />
          <GoalProjection />
          <ProductRecommendationTabs />
          <Stack spacing={2}>
            {isGoodLead ? (
              <>
                <ContactAdvisor />
                <AdvisorProfile />
              </>
            ) : null}

            {subscriptionType !== 'TRANSACT' ? (
              <Paper sx={{ p: 2 }}>
                <SendFinancialPlanButton />
              </Paper>
            ) : null}

            <ExploreGoal />

            {subscriptionType === 'TRANSACT' && canPerformTransactActions ? (
              <InvestNowAction />
            ) : null}
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

export default GoalInsightPage;
