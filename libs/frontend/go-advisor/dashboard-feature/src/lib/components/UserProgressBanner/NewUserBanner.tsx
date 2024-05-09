import { Typography, Stack } from '@bambu/react-ui';
import Banner from '../Banner/Banner';

export const NewUserBanner = () => (
  <Banner data-testid="new-user-banner">
    <Stack spacing={1}>
      <Typography variant="h5">Welcome to Bambu GO</Typography>
      <Typography>Complete the tasks below to get started</Typography>
    </Stack>
  </Banner>
);

export default NewUserBanner;
