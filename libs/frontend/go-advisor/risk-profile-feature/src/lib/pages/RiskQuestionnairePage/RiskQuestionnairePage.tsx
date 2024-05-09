import { useEffect } from 'react';
import { Stack } from '@bambu/react-ui';
import { Heading } from '@bambu/go-advisor-core';
import RiskCapacityQuestionnaire from '../../components/RiskCapacityQuestionnaire/RiskCapacityQuestionnaire';
import RiskToleranceQuestionnaire from '../../components/RiskToleranceQuestionnaire/RiskToleranceQuestionnaire';
import {
  BackToDashboardBanner,
  useSelectSetUserData,
} from '@bambu/go-advisor-core';

export function RiskQuestionnairePage() {
  const setUserData = useSelectSetUserData();

  useEffect(() => {
    setUserData({ isQuestionnaireReviewed: true });
  }, [setUserData]);

  return (
    <Stack spacing={4}>
      <Heading
        title="Risk questionnaire"
        subtitle={
          <>
            Bambu GO’s risk questionnaire is designed to understand the client’s
            risk capacity and risk tolerance to determine the most suitable
            investment for their goal.
          </>
        }
      />
      <RiskCapacityQuestionnaire />
      <RiskToleranceQuestionnaire />
      <BackToDashboardBanner
        title="Finished reviewing the risk questionnaire?"
        subtitle="Continue to get your robo transaction-ready by following the setup tasks on the dashboard."
      />
    </Stack>
  );
}

export default RiskQuestionnairePage;
