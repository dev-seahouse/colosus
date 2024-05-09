import { Container, Stack, Typography, Box } from '@bambu/react-ui';

import Icon from './assets/group.svg';

export const MobileView = () => (
  <Container>
    <Stack spacing={2} py={4}>
      <Box display="flex" justifyContent="space-around">
        <img src={Icon} alt="mobile view" width={72} height={72} />
      </Box>
      <Stack spacing={1}>
        <Typography variant="h5" textAlign="center">
          We’ve got big things to show you!
        </Typography>
        <Typography textAlign="center">
          Please enlarge your browser window or use a larger screen such as a
          laptop or desktop computer to view this page.
        </Typography>
      </Stack>
    </Stack>
  </Container>
);

export default MobileView;
