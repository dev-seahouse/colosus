import type { Meta, StoryObj } from '@storybook/react';
import { BottomActionLayout } from './BottomActionLayout';
import { Box, Button, Stack } from '@bambu/react-ui';

const meta: Meta<typeof BottomActionLayout> = {
  component: BottomActionLayout,
  title: 'core/layouts/BottomActionLayout',
  tags: ['autodocs'],
};
type Story = StoryObj<typeof BottomActionLayout>;

export const Primary: Story = {
  render: () => (
    <Box>
      <Stack alignItems={'center'}>
        <h1>Title</h1>
        <BottomActionLayout>
          <Box display="flex" justifyContent={'center'} width="100%">
            <Button type="submit">Next</Button>
          </Box>
        </BottomActionLayout>
      </Stack>
    </Box>
  ),
};

/**
 * A typical pattern is to render full width buttons side by side on mobile at bottom
 * but layout the buttons in content-width side by side on desktop
 * resize and try to see it.
 */
export const TwoButtons: Story = {
  render: () => (
    <Box>
      <Stack alignItems={'center'}>
        <h1>Title</h1>
        <BottomActionLayout
          sx={{ display: 'flex', justifyContent: 'center', gap: '15px' }}
        >
          <Button type="button" variant="outlined" sx={{ flex: [1, 0] }}>
            Cancel
          </Button>
          <Button type="submit" sx={{ flex: [1, 0] }}>
            Continue
          </Button>
        </BottomActionLayout>
      </Stack>
    </Box>
  ),
};

export default meta;
