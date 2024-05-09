import { Stack, Typography, MuiLink } from '@bambu/react-ui';

export const SchedulingPlatformLinkSectionHeader = () => {
  return (
    <Stack spacing={1}>
      <Typography fontWeight={700}>
        Do you use an external platform to schedule meetings with clients?
      </Typography>
      <Typography>
        If you use a scheduling platform like{' '}
        <MuiLink
          href="https://calendly.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Calendly
        </MuiLink>
        , provide your public scheduling link below and your qualified leads
        will be directed to schedule a meeting with you as part of your
        robo-advisor experience.
      </Typography>
    </Stack>
  );
};

export default SchedulingPlatformLinkSectionHeader;
