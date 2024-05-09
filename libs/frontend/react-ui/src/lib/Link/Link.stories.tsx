import type { Meta } from '@storybook/react';
import { Link } from './Link';

const Story: Meta<typeof Link> = {
  component: Link,
  title: 'Link',
};
export default Story;

export const Primary = {
  args: {
    children: 'Link',
    to: 'login',
  },
};
