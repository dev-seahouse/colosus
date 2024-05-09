import type { Meta } from '@storybook/react';
import { Heading } from './Heading';

const Story: Meta<typeof Heading> = {
  component: Heading,
  title: 'Auth/components/Heading',
};
export default Story;

export const WithSubtitle = {
  args: {
    title: 'Welcome to Bambu GO',
    subtitle: 'Hello World',
  },
};

export const WithoutSubtitle = {
  args: {
    title: 'Welcome to Bambu GO',
  },
};
