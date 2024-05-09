import { Box, Stack, Typography } from '@bambu/react-ui';
import Heading from '../Heading/Heading';
import LoginLink from '../LoginLink/LoginLink';

export function ResetPasswordSuccess() {
  return (
    <Stack spacing={2}>
      <Heading title="Your password has been updated" />
      <Typography
        variant="h2"
        sx={{ fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 }}
      >
        Please log in with your updated password to access your account.
      </Typography>
      <Box py={2}>
        <LoginLink label="" linkText="Back to Login" />
      </Box>
    </Stack>
  );
}

export default ResetPasswordSuccess;
