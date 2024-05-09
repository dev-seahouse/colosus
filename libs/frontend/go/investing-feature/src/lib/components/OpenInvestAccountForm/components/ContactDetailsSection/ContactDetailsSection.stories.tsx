import type { Meta, StoryObj } from '@storybook/react';
import { ContactDetailsSection } from './ContactDetailsSection';
import { hookFormDecorator } from '@bambu/storybook-utils';

const meta: Meta<typeof ContactDetailsSection> = {
  component: ContactDetailsSection,
  title: 'investing/components/ContactDetailsSection',
};
export default meta;
type Story = StoryObj<typeof ContactDetailsSection>;

export const Primary = {
  args: {},
  decorators: [hookFormDecorator({})],
};
