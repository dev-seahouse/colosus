import { Stack, Typography } from '@bambu/react-ui';
import Heading from '../Heading/Heading';
import LoginLink from '../LoginLink/LoginLink';
import { useSelectResetPasswordUsername } from '../../store/useAuthStore.selectors';

export function ResetPasswordInstruction() {
  const userEmail = useSelectResetPasswordUsername();

  return (
    <Stack spacing={3}>
      <Heading title="Reset instructions sent" />
      <Stack spacing={4}>
        <Stack spacing={2}>
          <Typography>
            If there is a Bambu GO account associated with the email{' '}
            <strong>{userEmail}</strong>, instructions for reseting your
            password will be sent to it.
          </Typography>
          <Typography>
            You’ll receive the email within 5 minutes. Be sure to check your
            spam folder.
          </Typography>
        </Stack>
        <LoginLink label="" linkText="Back to Login" />
      </Stack>
    </Stack>
  );
}

export default ResetPasswordInstruction;
