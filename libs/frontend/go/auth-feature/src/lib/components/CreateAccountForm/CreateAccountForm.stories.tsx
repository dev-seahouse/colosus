import type { Meta, StoryObj } from '@storybook/react';
import { CreateAccountForm } from './CreateAccountForm';

const meta: Meta<typeof CreateAccountForm> = {
  component: CreateAccountForm,
  title: 'Auth/components/CreateAccountForm',
};
export default meta;
type Story = StoryObj<typeof CreateAccountForm>;

export const Primary = {
  args: {},
};
