import type { Meta, StoryObj } from '@storybook/react';
import { GoalDetailsTabs } from './GoalDetailsTabs';

const meta: Meta<typeof GoalDetailsTabs> = {
  component: GoalDetailsTabs,
  title: 'manage-goals/components/GoalDetailsTabs',
};
export default meta;
type Story = StoryObj<typeof GoalDetailsTabs>;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      location: {
        pathParams: { goalId: '0a9cade0-66ec-479b-b6f3-ad7c3fafb55f' },
      },
      routing: { path: '/goalDetails/:goalId' },
    },
  },
};
