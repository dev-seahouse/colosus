import type { Meta } from '@storybook/react';
import { LoginForm } from './LoginForm';

const Story: Meta<typeof LoginForm> = {
  component: LoginForm,
  title: 'Auth/components/LoginForm',
};
export default Story;

export const Primary = {
  args: {},
};
