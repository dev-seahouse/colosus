import { Stack, Typography } from '@bambu/react-ui';
import type { ReactNode } from 'react';

export interface HeadingProps {
  title: ReactNode;
  subtitle?: ReactNode;
}

export function Heading({ title, subtitle }: HeadingProps) {
  return (
    <Stack spacing={1}>
      <Typography
        textAlign="center"
        mobiletextalign="left"
        variant="h5"
        fontWeight={700}
      >
        {title}
      </Typography>
      {subtitle ? (
        <Typography textAlign="center" mobiletextalign="left">
          {subtitle}
        </Typography>
      ) : null}
    </Stack>
  );
}

export default Heading;
