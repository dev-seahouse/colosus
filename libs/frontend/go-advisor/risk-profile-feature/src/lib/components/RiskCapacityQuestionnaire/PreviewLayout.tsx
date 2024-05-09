import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Header, Stack, useMobileView } from '@bambu/react-ui';
import { ProgressBar } from '@bambu/go-core';

export function PreviewLayout({ children = <Outlet /> }: PropsWithChildren) {
  const isMobile = useMobileView();

  return (
    <Box display="flex" flexDirection="column" sx={{ minHeight: '100vh' }}>
      <Header />
      {isMobile && <ProgressBar />}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container sx={{ pb: 2 }}>
          <Stack spacing={isMobile ? 2 : 7}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-around"
              sx={{
                position: 'relative',
                height: 40,
              }}
            >
              {!isMobile && (
                <Box sx={{ width: '50%' }}>
                  <ProgressBar />
                </Box>
              )}
            </Box>
            <Box>{children}</Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

export default PreviewLayout;
