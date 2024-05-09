import { BottomActionLayout } from '@bambu/go-core';
import { Button, Link, Stack, TextField, Typography } from '@bambu/react-ui';

export function VerifyTransactionForm() {
  return (
    <Stack>
      <Typography sx={{ fontSize: 28 }}>Verify your transaction</Typography>
      <Typography sx={{ fontSize: 16, color: '#444845', marginTop: 2 }}>
        We sent a 6-digit verification code to
      </Typography>
      <Typography sx={{ fontSize: 16, color: '#444845', fontWeight: '700' }}>
        wesley@email.com
      </Typography>
      <TextField label="Enter code" sx={{ marginTop: 2 }} />
      <Typography sx={{ fontSize: 16, color: '#444845', marginY: 2 }}>
        Did not receive the code? <Link to="">Resend</Link>
      </Typography>
      <BottomActionLayout>
        <Button fullWidth>Verify</Button>
      </BottomActionLayout>
    </Stack>
  );
}

export default VerifyTransactionForm;
