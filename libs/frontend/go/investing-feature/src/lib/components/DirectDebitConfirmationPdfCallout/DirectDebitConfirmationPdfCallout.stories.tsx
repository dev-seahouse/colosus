import type { Meta, StoryObj } from '@storybook/react';
import { DirectDebitConfirmationPdfCallout } from './DirectDebitConfirmationPdfCallout';

const meta: Meta<typeof DirectDebitConfirmationPdfCallout> = {
  component: DirectDebitConfirmationPdfCallout,
  title: 'investing/components/DirectDebitConfirmationPdfCallout',
};
export default meta;
type Story = StoryObj<typeof DirectDebitConfirmationPdfCallout>;

export const Primary = {
  args: {},
};
