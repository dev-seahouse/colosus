import type { Meta, StoryObj } from '@storybook/react';
import { SpeedoMeter } from './SpeedoMeter';

const meta: Meta<typeof SpeedoMeter> = {
  component: SpeedoMeter,
  title: 'goal-settings/components/SpeedoMeter',
};
export default meta;
type Story = StoryObj<typeof SpeedoMeter>;

export const Primary = {
  args: {
    level: 1,
  },
};
