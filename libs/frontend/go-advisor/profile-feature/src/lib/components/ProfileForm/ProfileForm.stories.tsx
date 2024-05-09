import type { Meta } from '@storybook/react';
import { ProfileForm } from './ProfileForm';

const Story: Meta<typeof ProfileForm> = {
  component: ProfileForm,
  title: 'Profile/components/ProfileForm',
};
export default Story;

export const Primary = {
  args: {},
};
