import { Header } from '@bambu/go-advisor-core';
import {
  Box,
  Container,
  LinearProgress,
  Stack,
  BackButton,
} from '@bambu/react-ui';
import { Outlet } from 'react-router-dom';

import {
  useSelectOnboardingProgress,
  useSelectShowBackButton,
} from '../../store/useProfileCreationStore.selectors';

export function OnboardingLayout() {
  const showBackButton = useSelectShowBackButton();
  const progress = useSelectOnboardingProgress();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        pt: 8,
      }}
    >
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container sx={{ pt: 10 }} maxWidth="md">
          <Stack spacing={7}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                position: 'relative',
              }}
            >
              {showBackButton && (
                <Box sx={{ position: 'absolute', left: 0 }}>
                  <BackButton />
                </Box>
              )}
              <Box sx={{ width: '50%' }}>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
            </Box>
            <Box>
              <Outlet />
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

export default OnboardingLayout;
