import type { Meta, StoryObj } from '@storybook/react';
import { PaymentSettingsContributionDetailsCard } from './PaymentSettingsContributionDetailsCard';
import { hookFormDecorator } from '@bambu/storybook-utils';

const meta: Meta<typeof PaymentSettingsContributionDetailsCard> = {
  component: PaymentSettingsContributionDetailsCard,
  title: 'investing/components/PaymentSettingsContributionDetailsCard',
};
export default meta;
type Story = StoryObj<typeof PaymentSettingsContributionDetailsCard>;

export const Primary: Story = {
  args: {
    children: <div>title</div>,
  },
  decorators: [hookFormDecorator()],
};
