import type { Meta, StoryObj } from '@storybook/react';
import { EmploymentDetailsSection } from './EmploymentDetailsSection';
import { hookFormDecorator } from '@bambu/storybook-utils';

const meta: Meta<typeof EmploymentDetailsSection> = {
  component: EmploymentDetailsSection,
  title: 'investing/components/EmploymentDetailsSection',
};
export default meta;
type Story = StoryObj<typeof EmploymentDetailsSection>;

export const Primary = {
  args: {},
  decorators: [hookFormDecorator({})],
};
