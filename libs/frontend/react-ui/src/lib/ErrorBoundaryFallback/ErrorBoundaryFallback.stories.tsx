import type { Meta } from '@storybook/react';
import { ErrorBoundaryFallback } from './ErrorBoundaryFallback';

const Story: Meta<typeof ErrorBoundaryFallback> = {
  component: ErrorBoundaryFallback,
  title: 'ErrorBoundaryFallback',
};
export default Story;

export const Primary = {
  args: {},
};
