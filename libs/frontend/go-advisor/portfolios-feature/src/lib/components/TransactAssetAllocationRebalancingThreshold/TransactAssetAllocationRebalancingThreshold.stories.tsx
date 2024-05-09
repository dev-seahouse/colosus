import type { Meta, StoryObj } from '@storybook/react';
import { TransactAssetAllocationRebalancingThreshold } from './TransactAssetAllocationRebalancingThreshold';
import { hookFormDecorator } from '@bambu/storybook-utils';

const meta: Meta<typeof TransactAssetAllocationRebalancingThreshold> = {
  component: TransactAssetAllocationRebalancingThreshold,
  title: 'portfolios/components/TransactAssetAllocationRebalancingThreshold',
};
export default meta;
type Story = StoryObj<typeof TransactAssetAllocationRebalancingThreshold>;

export const Primary = {
  args: {},
  decorators: [hookFormDecorator()],
};
