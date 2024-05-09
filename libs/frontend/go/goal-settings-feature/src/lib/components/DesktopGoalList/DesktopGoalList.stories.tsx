import type { Meta } from '@storybook/react';
import { DesktopGoalList } from './DesktopGoalList';

const Story: Meta<typeof DesktopGoalList> = {
  component: DesktopGoalList,
  title: 'Goal-settings/components/DesktopGoalList',
};
export default Story;

export const Primary = {
  args: {},
};
