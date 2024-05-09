import type { Meta, StoryObj } from '@storybook/react';
import { DirectDebitMandateSetupForm } from './DirectDebitMandateSetupForm';

const meta: Meta<typeof DirectDebitMandateSetupForm> = {
  component: DirectDebitMandateSetupForm,
  title: 'investing/components/DirectDebitMandateSetupForm',
};
export default meta;
type Story = StoryObj<typeof DirectDebitMandateSetupForm>;

export const Primary = {
  args: {},
};
