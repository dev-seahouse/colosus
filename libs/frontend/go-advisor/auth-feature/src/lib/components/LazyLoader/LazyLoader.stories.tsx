import type { Meta } from '@storybook/react';
import { LazyLoader } from './LazyLoader';

const Story: Meta<typeof LazyLoader> = {
  component: LazyLoader,
  title: 'Auth/components/LazyLoader',
};
export default Story;

export const Primary = {
  args: {},
};
