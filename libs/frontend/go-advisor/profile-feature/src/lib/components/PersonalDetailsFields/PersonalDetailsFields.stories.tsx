import type { Meta } from '@storybook/react';
import { hookFormDecorator } from '@bambu/storybook-utils';
import { PersonalDetailsFields } from './PersonalDetailsFields';

const Story: Meta<typeof PersonalDetailsFields> = {
  component: PersonalDetailsFields,
  title: 'Profile/components/PersonalDetailsFields',
};
export default Story;

export const Primary = {
  args: {},
  decorators: [hookFormDecorator({})],
};
