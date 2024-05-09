import type { Meta } from '@storybook/react';
import { ResetPasswordUpdateForm } from './ResetPasswordUpdateForm';

const Story: Meta<typeof ResetPasswordUpdateForm> = {
  component: ResetPasswordUpdateForm,
  title: 'Auth/components/ResetPasswordUpdateForm',
};
export default Story;

export const Primary = {
  args: {},
};
