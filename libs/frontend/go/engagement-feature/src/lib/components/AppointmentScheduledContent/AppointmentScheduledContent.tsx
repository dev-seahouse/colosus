import { Stack, Box } from '@bambu/react-ui';
import { useSelectName, useSelectAdvisorHasContactLink } from '@bambu/go-core';

import Heading from '../Heading/Heading';
import BackToInsightPageButton from '../BackToInsightPageButton/BackToInsightPageButton';
import AppointmentScheduledIcon from './AppointmentScheduleIcon';
import AppointmentScheduledMessage from './AppointmentScheduledMessage';
import AppointmentScheduledWithLinkMessage from './AppointmentScheduledWithLinkMessage';

export function AppointmentScheduledContent() {
  const name = useSelectName();
  const { data: advisorHasContactLink } = useSelectAdvisorHasContactLink();

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
          title={`${name}, we're excited to help you achieve your goals!`}
        />
        {advisorHasContactLink ? (
          <AppointmentScheduledWithLinkMessage />
        ) : (
          <AppointmentScheduledMessage />
        )}
        <Box display="flex" justifyContent="space-around">
          <BackToInsightPageButton />
        </Box>
      </Stack>
    </Stack>
  );
}

export default AppointmentScheduledContent;
