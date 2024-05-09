import type { Meta } from '@storybook/react';
import { GoalSettingsPage } from './GoalSettingsPage';

const Story: Meta<typeof GoalSettingsPage> = {
  component: GoalSettingsPage,
  title: 'goal-settings/pages/GoalSettingsPage',
};
export default Story;

export const Primary = {
  args: {},
};
