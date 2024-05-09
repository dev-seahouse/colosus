import { Stack, Typography } from '@bambu/react-ui';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import type { PropsWithChildren } from 'react';

// TODO extract this to pod with bg
export function OpenAccountFormFieldCallout({
  isShown = false,
  children,
}: PropsWithChildren<{ isShown?: boolean | null }>) {
  if (!isShown) {
    return;
  }
  return (
    <Stack
      direction={'row'}
      spacing={1}
      justifyContent={'flex-start'}
      p={2}
      sx={{
        '&&': { marginTop: 0 },
        backgroundColor: '#F3FFF8',
      }}
    >
      <LightbulbIcon
        sx={{
          color: '#00876a',
          fontSize: 28,
        }}
      />
      <Typography variant={'body2'} fontWeight={500}>
        {children}
      </Typography>
    </Stack>
  );
}

export default OpenAccountFormFieldCallout;
