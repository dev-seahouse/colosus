import type { Meta } from '@storybook/react';
import { ConfigureGoalsForm } from './ConfigureGoalsForm';
import { hookFormDecorator } from '@bambu/storybook-utils';

const Story: Meta<typeof ConfigureGoalsForm> = {
  component: ConfigureGoalsForm,
  title: 'Goals/components/ConfigureGoalsForm',
};
export default Story;

export const Primary = {
  args: {},
  decorators: [hookFormDecorator({})],
};
