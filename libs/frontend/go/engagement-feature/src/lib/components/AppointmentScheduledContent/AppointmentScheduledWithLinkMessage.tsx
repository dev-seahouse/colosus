import { Typography, Stack, MuiLink } from '@bambu/react-ui';
import { useSelectAdvisorContactLink } from '@bambu/go-core';

import useEmailSearchParams from './useEmailSearchParams';

const APPOINTMENT_SCHEDULED_WITH_LINK_MESSAGE = {
  true: 'We have emailed your financial plan to you and have redirected you to our scheduling site to set up a 1-to-1 meeting.',
  false:
    'We have redirected you to our scheduling site to set up a 1-to-1 meeting.',
};

export const AppointmentScheduledWithLinkMessage = () => {
  const emailSent = useEmailSearchParams();
  const { data: contactLink } = useSelectAdvisorContactLink();

  return (
    <Stack spacing={1} data-testid="appointment-scheduled-with-link">
      <Typography
        textAlign="center"
        mobiletextalign="left"
        data-testid={`email-with-link-sent-${emailSent}`}
      >
        {
          APPOINTMENT_SCHEDULED_WITH_LINK_MESSAGE[
            String(emailSent) as 'true' | 'false'
          ]
        }
      </Typography>
      <Typography textAlign="center" mobiletextalign="left">
        Didn’t see our scheduling platform? You can schedule a meeting with us{' '}
        <MuiLink href={contactLink} target="_blank">
          here
        </MuiLink>{' '}
        or check your email inbox for the link.
      </Typography>
    </Stack>
  );
};

export default AppointmentScheduledWithLinkMessage;
