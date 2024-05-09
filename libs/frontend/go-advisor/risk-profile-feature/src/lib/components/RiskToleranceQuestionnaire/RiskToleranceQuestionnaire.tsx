import { Card, CardContent, Stack, Typography } from '@bambu/react-ui';
import RiskCapacityQuestionPreviewTrigger from '../RiskCapacityQuestionnaire/RiskCapacityQuestionPreviewTrigger';
import {
  RetirementFlowPage,
  InvestmentStyleQuestionOne,
  InvestmentStyleQuestionTwo,
} from '@bambu/go-goal-settings-feature';
import { RiskCapacityQuesionPreview } from '../RiskCapacityQuestionnaire/RiskCapacityQuestionPreview';

// Remove for Transact MVP
// import RiskToleranceConfigurationWizardTrigger from '../RiskToleranceConfigurationWizard/RiskToleranceConfigurationWizardTrigger';

export function RiskToleranceQuestionnaire() {
  const previewDescription = '';
  return (
    <Card>
      <CardContent sx={{ p: 5 }}>
        <Stack spacing={2}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle1" fontWeight={700}>
                Risk tolerance questionnaire
              </Typography>
              <RiskCapacityQuestionPreviewTrigger
                previewDescription={previewDescription}
                previewComponent={
                  <RetirementFlowPage>
                    <RiskCapacityQuesionPreview>
                      <InvestmentStyleQuestionOne />
                    </RiskCapacityQuesionPreview>
                  </RetirementFlowPage>
                }
              />
            </Stack>
            <Typography>
              To determine the amount of risk that an investor is comfortable
              taking that an investor is able to handle.
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default RiskToleranceQuestionnaire;
