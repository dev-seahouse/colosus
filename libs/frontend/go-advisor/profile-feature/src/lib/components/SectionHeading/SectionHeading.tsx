import { Typography, Stack } from '@bambu/react-ui';
import type { ReactNode } from 'react';
export interface SectionHeadingProps {
  title?: ReactNode;
  subtitle?: ReactNode;
}

export function SectionHeading({
  title = 'Section title',
  subtitle,
}: SectionHeadingProps) {
  return (
    <Stack spacing={1}>
      <Typography fontWeight={700}>{title}</Typography>
      {subtitle && <Typography variant="body2">{subtitle}</Typography>}
    </Stack>
  );
}

export default SectionHeading;
