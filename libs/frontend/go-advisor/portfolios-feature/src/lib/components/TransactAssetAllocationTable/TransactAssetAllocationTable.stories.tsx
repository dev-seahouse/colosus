import type { Meta, StoryObj } from '@storybook/react';
import { TransactAssetAllocationTable } from './TransactAssetAllocationTable';
import { hookFormDecorator } from '@bambu/storybook-utils';

const meta: Meta<typeof TransactAssetAllocationTable> = {
  component: TransactAssetAllocationTable,
  title: 'portfolios/components/ConfigurePortfolioProductsTable',
};
export default meta;
type Story = StoryObj<typeof TransactAssetAllocationTable>;

export const Primary = {
  args: {},
  decorators: [hookFormDecorator()],
};
