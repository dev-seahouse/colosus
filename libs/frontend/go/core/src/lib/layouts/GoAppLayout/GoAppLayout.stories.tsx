import type { Meta, StoryObj } from '@storybook/react';
import { GoAppLayout } from './GoAppLayout';

const meta: Meta<typeof GoAppLayout> = {
  component: GoAppLayout,
  title: 'core/Layouts/GoAppLayout',
};
export default meta;
type Story = StoryObj<typeof GoAppLayout>;

export const Primary = {
  args: {},
};
