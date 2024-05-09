import type { Meta, StoryObj } from '@storybook/react';
import { PersonalDetailsSection } from './PersonalDetailsSection';
import { hookFormDecorator } from '@bambu/storybook-utils';

const meta: Meta<typeof PersonalDetailsSection> = {
  component: PersonalDetailsSection,
  title: 'investing/components/PersonalDetailsSection',
};
export default meta;
type Story = StoryObj<typeof PersonalDetailsSection>;

export const Primary = {
  args: {},
  decorators: [hookFormDecorator({})],
};
