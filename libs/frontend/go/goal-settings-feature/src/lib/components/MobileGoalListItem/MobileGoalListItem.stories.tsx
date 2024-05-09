import type { Meta } from '@storybook/react';
import { MobileGoalListItem } from './MobileGoalListItem';

const Story: Meta<typeof MobileGoalListItem> = {
  component: MobileGoalListItem,
  title: 'Goal-settings/components/MobileGoalListItem',
};
export default Story;

export const Default = {
  args: {},
};

export const Selected = {
  args: {
    selected: true,
  },
};
