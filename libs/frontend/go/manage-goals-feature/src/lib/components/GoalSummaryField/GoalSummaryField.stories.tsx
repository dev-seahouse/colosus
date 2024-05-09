import type { Meta, StoryObj } from '@storybook/react';
import { GoalSummaryField } from './GoalSummaryField';
import { Card, CardContent, Stack } from '@bambu/react-ui';

const meta: Meta<typeof GoalSummaryField> = {
  component: GoalSummaryField,
  title: 'manage-goals/components/GoalSummaryField',
};
export default meta;
type Story = StoryObj<typeof GoalSummaryField>;

export const Primary: Story = {
  args: {
    title: 'Title',
    value: '123',
  },
  decorators: [
    (Story) => (
      <Card>
        <CardContent>
          <Stack>
            <Story />
          </Stack>
        </CardContent>
      </Card>
    ),
  ],
};
