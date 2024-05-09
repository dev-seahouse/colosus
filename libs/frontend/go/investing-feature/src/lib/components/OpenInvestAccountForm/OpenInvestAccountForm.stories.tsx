import type { Meta, StoryObj } from '@storybook/react';
import { OpenInvestAccountForm } from './OpenInvestAccountForm';

const meta: Meta<typeof OpenInvestAccountForm> = {
  component: OpenInvestAccountForm,
  title: 'investing/components/OpenInvestAccountForm',
};
export default meta;
type Story = StoryObj<typeof OpenInvestAccountForm>;

export const Primary = {
  args: {},
};
