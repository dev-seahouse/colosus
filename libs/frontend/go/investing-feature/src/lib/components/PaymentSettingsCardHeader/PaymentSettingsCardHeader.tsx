import { Box, Typography } from '@bambu/react-ui';
import type { PropsWithChildren } from 'react';

export function PaymentSettingsCardHeader({ children }: PropsWithChildren) {
  return (
    <Box pb={1.7}>
      <Typography variant={'h2'} fontSize={'1rem'} fontWeight={'bold'}>
        {children}
      </Typography>
    </Box>
  );
}

export default PaymentSettingsCardHeader;
