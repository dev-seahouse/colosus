import type { Meta, StoryObj } from '@storybook/react';
import { AccountInfoSection } from './AccountInfoSection';
import { hookFormDecorator } from '@bambu/storybook-utils';

const meta: Meta<typeof AccountInfoSection> = {
  component: AccountInfoSection,
  title: 'investing/components/AccountInfoSection',
};
export default meta;
type Story = StoryObj<typeof AccountInfoSection>;

export const Primary = {
  args: {},
  decorators: [hookFormDecorator({})],
};
