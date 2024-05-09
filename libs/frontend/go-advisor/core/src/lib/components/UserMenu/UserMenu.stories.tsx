import type { Meta, StoryObj } from '@storybook/react';
import { UserMenu } from './UserMenu';

const Story: Meta<typeof UserMenu> = {
  component: UserMenu,
  title: 'Core/components/UserMenu',
};
export default Story;

type Story = StoryObj<typeof UserMenu>;

export const DuringProfileCreation: Story = {
  args: {},
  parameters: {
    reactQuery: {
      enableDevtools: true,
      setQueryData: {
        queryKey: 'getProfileDetails',
        data: {
          username: 'matius@bambu.co',
        },
      },
    },
  },
};

export const PostProfileCreation: Story = {
  args: {},
};
