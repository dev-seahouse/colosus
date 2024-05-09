import { Typography, Stack } from '@bambu/react-ui';
import type { ReactNode } from 'react';
export interface HeadingProps {
  /**
   * The title of the heading
   */
  title: string;
  /**
   * The subtitle of the heading
   */
  subtitle?: ReactNode;
}

/**
 * Heading component mainly used by features in dashboard
 */
export function Heading({ title = 'Title goes here', subtitle }: HeadingProps) {
  return (
    <Stack spacing={3}>
      <Typography variant="h1">{title}</Typography>
      {subtitle && <Typography>{subtitle}</Typography>}
    </Stack>
  );
}

export default Heading;
