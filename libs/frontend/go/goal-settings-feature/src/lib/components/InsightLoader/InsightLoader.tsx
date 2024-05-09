import { Box, Stack, Typography, Container } from '@bambu/react-ui';

import Lottie from 'lottie-react';
import animationData from './lotties/financial_plan_loader.json';

export function InsightLoader() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{ flexGrow: 1, backgroundColor: '#FFFFFF' }}
      justifyContent="space-around"
    >
      <Container>
        <Stack spacing={3}>
          <Box display="flex" justifyContent="space-around">
            <Lottie
              animationData={animationData}
              loop={true}
              style={{ height: 300 }}
            />
          </Box>
          <Typography textAlign="center">
            Creating a personalized financial plan for you
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export default InsightLoader;
