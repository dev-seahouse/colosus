import type { Meta } from '@storybook/react';
import { Heading } from './Heading';

const Story: Meta<typeof Heading> = {
  component: Heading,
  title: 'Core/components/Heading',
};
export default Story;

export const WithoutSubtitle = {
  args: {},
};

export const WithSubtitle = {
  args: {
    subtitle: 'Subtitle goes here',
  },
};
