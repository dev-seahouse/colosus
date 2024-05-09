import type { Meta } from '@storybook/react';
import { ConnectBanner } from './ConnectBanner';

const Story: Meta<typeof ConnectBanner> = {
  component: ConnectBanner,
  title: 'Dashboard/components/ConnectBanner',
};
export default Story;

export const Default = {
  args: {},
};
