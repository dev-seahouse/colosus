import { Card, CardContent, Typography, Stack } from '@bambu/react-ui';
import type { ReactNode } from 'react';

export interface SectionContainerProps {
  children?: ReactNode;
  title?: string;
}

export function SectionContainer({
  children = 'children goes here',
  title,
}: SectionContainerProps) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2} sx={{ pb: 2 }}>
          {title && (
            <Typography sx={{ fontWeight: 400, fontSize: '1.5rem' }}>
              {title}
            </Typography>
          )}
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default SectionContainer;
