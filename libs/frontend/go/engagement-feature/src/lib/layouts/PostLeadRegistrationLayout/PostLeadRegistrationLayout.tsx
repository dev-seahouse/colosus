import { Header } from '@bambu/go-core';
import { Container, useMobileView, Stack } from '@bambu/react-ui';

import ThingsToDoRightNow from '../../components/ThingsToDoRightNow/ThingsToDoRightNow';

import type { ReactNode } from 'react';

export interface PostLeadRegistrationLayoutProps {
  children?: ReactNode;
}

export function PostLeadRegistrationLayout({
  children = 'children here',
}: PostLeadRegistrationLayoutProps) {
  const isMobileView = useMobileView();

  return (
    <>
      <Header />
      <Container
        sx={(theme) => ({
          flexGrow: 1,
          [theme.breakpoints.down('md')]: {
            display: 'flex',
            alignItems: 'center',
          },
        })}
      >
        <Stack spacing={3}>
          {children}
          {!isMobileView && <ThingsToDoRightNow />}
        </Stack>
      </Container>
      {isMobileView && <ThingsToDoRightNow />}
    </>
  );
}

export default PostLeadRegistrationLayout;
