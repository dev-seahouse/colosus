import type { Meta } from '@storybook/react';
import { DesktopGoalCard } from './DesktopGoalCard';

const Story: Meta<typeof DesktopGoalCard> = {
  component: DesktopGoalCard,
  title: 'Goal-settings/components/DesktopGoalCard',
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
