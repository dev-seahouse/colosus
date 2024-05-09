import type { Meta } from '@storybook/react';
import { SuspenseFallback } from './SuspenseFallback';

const Story: Meta<typeof SuspenseFallback> = {
  component: SuspenseFallback,
  title: 'SuspenseFallback',
};
export default Story;

export const Primary = {
  args: {},
};
