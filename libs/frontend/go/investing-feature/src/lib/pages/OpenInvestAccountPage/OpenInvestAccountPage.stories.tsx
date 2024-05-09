import type { Meta, StoryObj } from '@storybook/react';
import { OpenInvestAccountPage } from './OpenInvestAccountPage';

const meta: Meta<typeof OpenInvestAccountPage> = {
  component: OpenInvestAccountPage,
  title: 'investing/pages/OpenInvestAccountPage',
};
export default meta;
type Story = StoryObj<typeof OpenInvestAccountPage>;

export const Primary = {
  args: {},
};
