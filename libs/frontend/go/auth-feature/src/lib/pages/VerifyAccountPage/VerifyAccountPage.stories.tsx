import type { Meta, StoryObj } from '@storybook/react';
import { VerifyAccountPage } from './VerifyAccountPage';

const meta: Meta<typeof VerifyAccountPage> = {
  component: VerifyAccountPage,
  title: 'Auth/pages/VerifyAccountPage',
};
export default meta;
type Story = StoryObj<typeof VerifyAccountPage>;

export const Primary = {
  args: {},
};
