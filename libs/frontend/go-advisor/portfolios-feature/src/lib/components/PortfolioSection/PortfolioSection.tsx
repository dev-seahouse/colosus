import { Typography, Stack } from '@bambu/react-ui';
import type { PropsWithChildren } from 'react';

interface PortfolioSectionBaseProps {
  title: string;
}

export type PortfolioSectionProps =
  PropsWithChildren<PortfolioSectionBaseProps>;

export function PortfolioSection({
  title = 'Title goes here',
  children = <p>Content goes here</p>,
}: PortfolioSectionProps) {
  return (
    <Stack spacing={2}>
      <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
}

export default PortfolioSection;
