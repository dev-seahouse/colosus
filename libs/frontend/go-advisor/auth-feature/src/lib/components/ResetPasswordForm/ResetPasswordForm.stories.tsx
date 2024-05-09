import type { Meta } from '@storybook/react';
import { ResetPasswordForm } from './ResetPasswordForm';

const Story: Meta<typeof ResetPasswordForm> = {
  component: ResetPasswordForm,
  title: 'Auth/components/ResetPasswordForm',
};
export default Story;

export const Primary = {
  args: {},
};
