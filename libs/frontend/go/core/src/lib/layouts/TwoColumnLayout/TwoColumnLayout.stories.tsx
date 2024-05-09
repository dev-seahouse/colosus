import type { Meta, StoryObj } from '@storybook/react';
import { TwoColumnLayout } from './TwoColumnLayout';
import { Box, Divider, Stack, Typography } from '@bambu/react-ui';

const meta: Meta<typeof TwoColumnLayout> = {
  component: TwoColumnLayout,
  title: 'core/layouts/TwoColumnLayout',
};
export default meta;
type Story = StoryObj<typeof TwoColumnLayout>;

export const Primary = {
  args: {
    children: [<div key="1">left column</div>, <div key="2">right column</div>],
  },
};

// No matter how long the content, children of two columns layout always remain
// equal width
export const MultipleColumns = {
  render: () => (
    <Stack divider={<Divider />}>
      <Typography fontWeight={'bold'} gutterBottom>
        Two column layout
      </Typography>
      <TwoColumnLayout>
        <Typography>dfdf dfdf dfdf dfd 455454 45 4 54 545 454 </Typography>
        <Typography>dfdfdfdf dfdfdf dfdf </Typography>
      </TwoColumnLayout>
      <TwoColumnLayout>
        <Typography>dfdfdfd dfdf</Typography>
        <Typography>dfdfdf dfdf dfd fd dfd fd dfd fdf dfd fd</Typography>
      </TwoColumnLayout>
      <TwoColumnLayout>
        <Typography>dfdfdfdf dfdf</Typography>
        <Typography>dfdf</Typography>
      </TwoColumnLayout>

      <Typography fontWeight={'bold'} gutterBottom>
        Flex box space between
      </Typography>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Typography>dfdf dfdf dfdf dfd 455454 45 4 54 545 454</Typography>
        <Typography>dfdfdfdf dfdfdf dfdf</Typography>
      </Box>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Typography>dfdfdfd dfdf</Typography>
        <Typography>dfdfdf dfdf dfd fd dfd fd dfd fdf dfd fd</Typography>
      </Box>
    </Stack>
  ),
};
