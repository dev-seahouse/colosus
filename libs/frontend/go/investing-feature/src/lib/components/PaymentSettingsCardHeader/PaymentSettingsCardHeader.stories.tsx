import type { Meta, StoryObj } from '@storybook/react';
import { PaymentSettingsCardHeader } from './PaymentSettingsCardHeader';
import { Card } from '@mui/material';

const meta: Meta<typeof PaymentSettingsCardHeader> = {
  component: PaymentSettingsCardHeader,
  title: 'investing/components/PaymentSettingsCardHeader',
};
export default meta;
type Story = StoryObj<typeof PaymentSettingsCardHeader>;

export const Primary: Story = {
  args: { children: 'card header goes here' },
  decorators: [(Story) => <Card>{Story()}</Card>],
};
