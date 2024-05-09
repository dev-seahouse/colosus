import type { Meta, StoryObj } from '@storybook/react';
import { DirectDebitConfirmDisclaimer } from './DirectDebitConfirmDisclaimer';

const meta: Meta<typeof DirectDebitConfirmDisclaimer> = {
  component: DirectDebitConfirmDisclaimer,
  title: 'investing/components/DirectDebitConfirmDisclaimer',
};
export default meta;
type Story = StoryObj<typeof DirectDebitConfirmDisclaimer>;

export const Primary = {
  args: {},
};
