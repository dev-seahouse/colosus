import type { SxProps } from '@bambu/react-ui';
import { Box, Typography } from '@bambu/react-ui';
import type { PropsWithChildren } from 'react';

export const LabelText = ({
  children,
  ...sx
}: PropsWithChildren<{ sx?: SxProps }>) => (
  <Typography fontSize={'11px'} color={'#8d918f'} {...sx}>
    {children}
  </Typography>
);
export const ContentText = ({
  children,
  ...sx
}: PropsWithChildren<{ sx?: SxProps }>) => (
  <Typography fontSize={'11px'} letterSpacing={'.5px'} color={'#000'} {...sx}>
    {children}
  </Typography>
);

export function Callout({ children, sx }: PropsWithChildren<{ sx?: SxProps }>) {
  return (
    <Box
      sx={{
        background: '#fafafa',
        border: '2px solid #e5e7eb',
        padding: '11px 18px',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

Callout.LabelText = LabelText;
Callout.ContentText = ContentText;

export default Callout;
