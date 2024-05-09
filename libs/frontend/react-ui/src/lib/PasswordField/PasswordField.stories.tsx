import type { Meta } from '@storybook/react';
import { PasswordField } from './PasswordField';

const Story: Meta<typeof PasswordField> = {
  component: PasswordField,
  title: 'For Developers/PasswordField',
};
export default Story;

export const Primary = {
  args: {},
};
