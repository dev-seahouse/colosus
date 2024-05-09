import type { Meta, StoryObj } from '@storybook/react';
import { HomeAddressSection } from './HomeAddressSection';
import { hookFormDecorator } from '@bambu/storybook-utils';

const meta: Meta<typeof HomeAddressSection> = {
  component: HomeAddressSection,
  title: 'investing/components/HomeAddressSection',
};
export default meta;
type Story = StoryObj<typeof HomeAddressSection>;

export const Primary = {
  args: {},
  decorators: [hookFormDecorator({})],
};
