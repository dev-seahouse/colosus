import { Card } from '@bambu/react-ui';
import type { ReactNode } from 'react';
import type { CardProps } from '@bambu/react-ui';

export type BannerProps = Omit<CardProps, 'sx'>;

export function Banner({
  children = <p>Content goes here</p>,
  ...rest
}: BannerProps) {
  return (
    <Card {...rest} sx={{ p: 4 }}>
      {children}
    </Card>
  );
}

export default Banner;
