import type { Meta, StoryObj } from '@storybook/react';
import { AssetAllocationTabs } from './AssetAllocationTabs';
import { hookFormDecorator } from '@bambu/storybook-utils';

const meta: Meta<typeof AssetAllocationTabs> = {
  component: AssetAllocationTabs,
  title: 'portfolios/components/AssetAllocationTabs',
};
export default meta;
type Story = StoryObj<typeof AssetAllocationTabs>;

export const Primary = {
  args: {},
  decorators: [hookFormDecorator()],
};
