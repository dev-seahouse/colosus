import type { Meta, StoryObj } from '@storybook/react';
import { OpenInvestAccountFormUnsavedChangeDialog } from './OpenInvestAccountFormUnsavedChangeDialog';
import { Box, Button } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';

const meta: Meta<typeof OpenInvestAccountFormUnsavedChangeDialog> = {
  component: OpenInvestAccountFormUnsavedChangeDialog,
  title: 'investing/components/OpenInvestAccountFormUnsavedChangeDialog',
};
export default meta;
type Story = StoryObj<typeof OpenInvestAccountFormUnsavedChangeDialog>;

export const Primary: Story = {
  args: {
    when: true,
  },
  decorators: [
    (Story) => {
      const navigate = useNavigate();
      return (
        <Box>
          <Button onClick={() => navigate(-1)}>Click me to open</Button>
          <Story />
        </Box>
      );
    },
  ],
};
