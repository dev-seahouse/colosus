import type { Meta } from '@storybook/react';
import { GoAppPreview } from './GoAppPreview';

const Story: Meta<typeof GoAppPreview> = {
  component: GoAppPreview,
  title: 'Core/components/GoAppPreview',
};
export default Story;

export const Default = {
  args: {},
};
