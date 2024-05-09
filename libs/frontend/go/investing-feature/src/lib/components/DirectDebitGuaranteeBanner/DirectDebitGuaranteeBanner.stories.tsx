import type { Meta, StoryObj } from '@storybook/react';
import { DirectDebitGuaranteeBanner } from './DirectDebitGuaranteeBanner';

const meta: Meta<typeof DirectDebitGuaranteeBanner> = {
  component: DirectDebitGuaranteeBanner,
  title: 'investing/components/DirectDebitGuaranteeBanner',
};
export default meta;
type Story = StoryObj<typeof DirectDebitGuaranteeBanner>;

export const Primary = {
  args: {},
};
