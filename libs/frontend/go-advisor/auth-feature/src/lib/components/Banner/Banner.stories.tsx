import type { Meta } from '@storybook/react';
import { Box } from '@bambu/react-ui';
import { Banner } from './Banner';

const Story: Meta<typeof Banner> = {
  component: Banner,
  title: 'Auth/components/Banner',
};
export default Story;

export const Primary = {
  render: () => (
    <Box sx={{ bgcolor: 'primary.main' }}>
      <Banner />
    </Box>
  ),
  args: {},
};
