import type { Meta, StoryObj } from '@storybook/react';
import { CreateAccountPage } from './CreateAccountPage';

const meta: Meta<typeof CreateAccountPage> = {
  component: CreateAccountPage,
  title: 'auth/pages/CreateAccountPage',
};
export default meta;
type Story = StoryObj<typeof CreateAccountPage>;

export const Primary = {
  args: {},
};
