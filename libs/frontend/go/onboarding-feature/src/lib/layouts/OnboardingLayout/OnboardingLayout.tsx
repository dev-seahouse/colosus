import { Header } from '@bambu/go-core';
import { Container } from '@bambu/react-ui';

import type { ReactNode } from 'react';

export interface OnboardingLayoutProps {
  children?: ReactNode;
}

export function OnboardingLayout({
  children = <p>Content goes here</p>,
}: OnboardingLayoutProps) {
  return (
    <>
      <Header />
      <Container>{children}</Container>
    </>
  );
}

export default OnboardingLayout;
