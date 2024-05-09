import { Header, BackButton, Container, Grid } from '@bambu/react-ui';
import { ExploreGoal } from '@bambu/go-core';

import ContactAdvisor from '../../components/ContactAdvisor/ContactAdvisor';
import AdvisorProfile from '../../components/AdvisorProfile/AdvisorProfile';
import SendFinancialPlanButton from '../../components/SendFinancialPlanButton/SendFinancialPlanButton';
import GoalInsightHeadline from '../../components/GoalInsightHeadline/GoalInsightHeadline';
import GoalProjectionV2 from '../../components/GoalProjectionV2/GoalProjectionV2';
import PortfolioBreakdown from '../../components/PortfolioBreakdown/PortfolioBreakdown';
import GoalControllerAccordion from '../../components/GoalControllerAccordion/GoalControllerAccordion';

/* eslint-disable-next-line */
export interface GoalInsightPageV2Props {}

export function GoalInsightPageV2(props: GoalInsightPageV2Props) {
  return (
    <>
      <Header />
      <Container>
        <Grid spacing={4} container>
          <Grid item xs={12}>
            <BackButton />
          </Grid>
          <Grid item xs={12}>
            <GoalInsightHeadline />
          </Grid>
          <Grid item xs={12}>
            <Grid spacing={3} container>
              <Grid item xs={12} md={4}>
                <GoalControllerAccordion />
              </Grid>
              <Grid item xs={12} md={8}>
                <Grid spacing={4} container>
                  <Grid item xs={12}>
                    <GoalProjectionV2 />
                  </Grid>
                  <Grid item xs={12}>
                    <SendFinancialPlanButton />
                  </Grid>
                  <Grid item xs={12}>
                    <PortfolioBreakdown />
                  </Grid>
                  <Grid item xs={12}>
                    <ContactAdvisor />
                  </Grid>
                  <Grid item xs={12}>
                    <AdvisorProfile />
                  </Grid>
                  <Grid item xs={12}>
                    <ExploreGoal />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default GoalInsightPageV2;
