import type { Meta } from '@storybook/react';
import { ContactMeForm } from './ContactMeForm';

const Story: Meta<typeof ContactMeForm> = {
  component: ContactMeForm,
  title: 'Content/components/ContactMeForm',
};
export default Story;

export const Primary = {
  args: {},
};
