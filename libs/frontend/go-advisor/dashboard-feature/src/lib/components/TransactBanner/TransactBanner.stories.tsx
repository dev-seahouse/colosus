import type { Meta } from '@storybook/react';
import { TransactBanner } from './TransactBanner';

const Story: Meta<typeof TransactBanner> = {
  component: TransactBanner,
  title: 'Dashboard/components/TransactBanner',
};
export default Story;

export const Default = {
  args: {},
};
