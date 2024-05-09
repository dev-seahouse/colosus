import { Stack, Box } from '@bambu/react-ui';

import Heading from '../Heading/Heading';
import BackToInsightPageButton from '../BackToInsightPageButton/BackToInsightPageButton';
// TODO: refactor this later
import AppointmentScheduledIcon from '../AppointmentScheduledContent/AppointmentScheduleIcon';

export function FinancialPlanSentContent() {
  return (
    <Stack spacing={3}>
      <Box display="flex" justifyContent="space-around">
        <AppointmentScheduledIcon
          color="primary"
          sx={{ width: 100, height: 100 }}
        />
      </Box>
      <Stack spacing={1}>
        <Heading
          title="Your financial plan is on its way!"
          subtitle="Check your email inbox in a few minutes."
        />
        <Box display="flex" justifyContent="space-around">
          <BackToInsightPageButton />
        </Box>
      </Stack>
    </Stack>
  );
}

export default FinancialPlanSentContent;
