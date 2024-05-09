import { Typography, Stack, Box, Button, MuiLink } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';
import ClientExperienceAccordionDetailsTitle from '../ClientExperienceAccordionDetailsTitle';

export const ActiveSubscriptionDetails = () => {
  const navigate = useNavigate();

  const handleGoToManageSubscription = () =>
    navigate('/dashboard/manage-subscription');

  return (
    <Stack
      spacing={2}
      sx={{ flexGrow: 1 }}
      data-testid="active-subscription-details"
    >
      <Stack spacing={3}>
        <ClientExperienceAccordionDetailsTitle>
          We're thrilled to have you on board and thank you for subscribing.
        </ClientExperienceAccordionDetailsTitle>
        <Stack spacing={2}>
          <Typography>
            Continue to set up your robo-advisor and begin sharing it with your
            prospect clients.
          </Typography>
          <Typography>
            If you have any questions, concerns, or need assistance, please
            reach out to our friendly support team at{' '}
            <MuiLink href="mailto:support@bambu.co">support@bambu.co</MuiLink>.
            We're here to ensure that you have a seamless and enjoyable
            experience using our platform.
          </Typography>
        </Stack>
      </Stack>
      <Box>
        <Button variant="outlined" onClick={handleGoToManageSubscription}>
          View my plan
        </Button>
      </Box>
    </Stack>
  );
};

export default ActiveSubscriptionDetails;
