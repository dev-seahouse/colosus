import type { Meta } from '@storybook/react';
import { AgeForm } from './AgeForm';

const Story: Meta<typeof AgeForm> = {
  component: AgeForm,
  title: 'Onboarding/components/AgeForm',
};
export default Story;

export const Primary = {
  args: {},
};
