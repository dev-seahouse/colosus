import type { Meta } from '@storybook/react';
import { Avatar } from './Avatar';

const Story: Meta<typeof Avatar> = {
  component: Avatar,
  title: 'Avatar',
};
export default Story;

export const Circle = {
  args: {
    children: 'AB',
  },
};

export const CircleWithFallback = {
  args: {},
};

export const CircleWithImage = {
  args: {
    src: 'https://material-ui.com/static/images/avatar/1.jpg',
  },
};

export const Rounded = {
  args: {
    children: 'AB',
    variant: 'rounded',
  },
};

export const RoundedWithFallback = {
  args: {
    variant: 'rounded',
  },
};

export const RoundedWithImage = {
  args: {
    src: 'https://material-ui.com/static/images/avatar/1.jpg',
    variant: 'rounded',
  },
};
