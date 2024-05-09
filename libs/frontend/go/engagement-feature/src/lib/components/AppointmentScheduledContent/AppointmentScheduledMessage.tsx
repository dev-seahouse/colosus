import { Typography, Box } from '@bambu/react-ui';

import useEmailSearchParams from './useEmailSearchParams';

const APPOINTMENT_SCHEDULED_MESSAGE = {
  true: 'We have emailed your financial plan to you and will be in touch soon.',
  false: 'We will be in touch soon.',
};

export const AppointmentScheduledMessage = () => {
  const emailSent = useEmailSearchParams();

  return (
    <Box data-testid="appointment-scheduled-without-link">
      <Typography
        textAlign="center"
        mobiletextalign="left"
        data-testid={`email-sent-${emailSent}`}
      >
        {APPOINTMENT_SCHEDULED_MESSAGE[String(emailSent) as 'true' | 'false']}
      </Typography>
    </Box>
  );
};

export default AppointmentScheduledMessage;
