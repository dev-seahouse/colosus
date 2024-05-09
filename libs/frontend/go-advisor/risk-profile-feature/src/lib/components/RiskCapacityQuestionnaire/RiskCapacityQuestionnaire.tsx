import { Card, CardContent, Stack, Typography } from '@bambu/react-ui';
import RiskCapacityQuestionList from './RiskCapacityQuestionList';

export function RiskCapacityQuestionnaire() {
  return (
    <Card>
      <CardContent sx={{ p: 5 }}>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle1" fontWeight={700}>
              Risk capacity questionnaire
            </Typography>
            <Typography>
              To determine the amount of risk that the investor "must" take in
              order to reach their financial goals
            </Typography>
          </Stack>
          <RiskCapacityQuestionList />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default RiskCapacityQuestionnaire;
