import type { Meta, StoryObj } from '@storybook/react';
import { TabPanel } from './TabPanel';

const meta: Meta<typeof TabPanel> = {
  component: TabPanel,
  title: 'manage-goals/components/TabPanel',
};
export default meta;
type Story = StoryObj<typeof TabPanel>;

export const Primary = {
  args: {
    tabsName: '',
    index: 0,
    value: 0,
  },
};
