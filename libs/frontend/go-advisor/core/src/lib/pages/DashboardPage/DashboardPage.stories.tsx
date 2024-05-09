import type { Meta } from '@storybook/react';
import { DashboardPage } from './DashboardPage';

const Story: Meta<typeof DashboardPage> = {
  component: DashboardPage,
  title: 'Core/pages/DashboardPage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <p>Sub-route goes here</p>,
    },
  },
};
