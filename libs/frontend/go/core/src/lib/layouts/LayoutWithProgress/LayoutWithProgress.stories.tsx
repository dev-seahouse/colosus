import type { Meta, StoryObj } from '@storybook/react';
import { LayoutWithProgress } from './LayoutWithProgress';

import { selectSetShowBackButton } from '../../store/useCoreStore.selectors';

const Story: Meta<typeof LayoutWithProgress> = {
  component: LayoutWithProgress,
  title: 'Core/layouts/LayoutWithProgress',
};
export default Story;

type Story = StoryObj<typeof LayoutWithProgress>;

const showBackButton = selectSetShowBackButton();

export const NoBackButton: Story = {
  render: (props) => {
    showBackButton(false);

    return <LayoutWithProgress {...props} />;
  },
  args: {
    children: <span>Children goes here</span>,
  },
};

export const WithBackButton: Story = {
  render: (props) => {
    showBackButton(true);

    return <LayoutWithProgress {...props} />;
  },
  args: {
    children: <span>Children goes here</span>,
  },
};
