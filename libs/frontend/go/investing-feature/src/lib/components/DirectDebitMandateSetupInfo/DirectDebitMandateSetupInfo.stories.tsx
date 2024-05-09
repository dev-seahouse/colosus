import type { Meta, StoryObj } from '@storybook/react';
import { DirectDebitMandateSetupInfo } from './DirectDebitMandateSetupInfo';

const meta: Meta<typeof DirectDebitMandateSetupInfo> = {
  component: DirectDebitMandateSetupInfo,
  title: 'investing/components/DirectDebitMandateSetupInfo',
};
export default meta;
type Story = StoryObj<typeof DirectDebitMandateSetupInfo>;

export const Primary = {
  args: {},
};
