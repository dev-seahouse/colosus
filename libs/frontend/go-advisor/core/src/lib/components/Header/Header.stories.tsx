import type { Meta } from '@storybook/react';
import { Header } from './Header';

const Story: Meta<typeof Header> = {
  component: Header,
  title: 'Core/components/Header',
};
export default Story;

export const Primary = {
  args: {},
};
