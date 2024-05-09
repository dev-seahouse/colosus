import { Stack, Typography } from '@bambu/react-ui';
import Illustration from './Illustration';

export function EmptyTransaction() {
  return (
    <Stack spacing={4}>
      <Stack
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Illustration />
        <Typography sx={{ fontSize: 14, fontWeight: 'bold', marginTop: 3 }}>
          No transaction history
        </Typography>
      </Stack>
    </Stack>
  );
}

export default EmptyTransaction;
