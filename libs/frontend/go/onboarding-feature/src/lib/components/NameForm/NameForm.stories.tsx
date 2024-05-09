import type { Meta } from '@storybook/react';
import NameForm from './NameForm';

const Story: Meta<typeof NameForm> = {
  component: NameForm,
  title: 'Onboarding/components/NameForm',
};
export default Story;

export const Primary = {
  args: {},
};
