import {
  Box,
  Container,
  Stack,
  useMobileView,
  BackButton,
} from '@bambu/react-ui';
import { Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';

import Header from '../../components/Header/Header';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import { useSelectShowBackButton } from '../../store/useCoreStore.selectors';

export interface LayoutWithProgressProps {
  children?: ReactNode;
}

// TODO: refactor this to be compositional, client should render
// progress bar and Container
export function LayoutWithProgress({
  children = <Outlet />,
}: LayoutWithProgressProps) {
  const isMobile = useMobileView();
  const isBackButtonShown = useSelectShowBackButton();

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
              {isBackButtonShown && (
                <Box sx={{ position: 'absolute', left: 0 }}>
                  <BackButton />
                </Box>
              )}
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

export default LayoutWithProgress;
