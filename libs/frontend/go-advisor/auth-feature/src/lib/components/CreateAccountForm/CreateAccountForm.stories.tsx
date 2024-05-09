import type { Meta } from '@storybook/react';
import { CreateAccountForm } from './CreateAccountForm';

const Story: Meta<typeof CreateAccountForm> = {
  component: CreateAccountForm,
  title: 'Auth/components/CreateAccountForm',
};
export default Story;

export const Primary = {
  args: {},
};
