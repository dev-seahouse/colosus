import type { Meta } from '@storybook/react';
import { VerifyAccountForm } from './VerifyAccountForm';

const Story: Meta<typeof VerifyAccountForm> = {
  component: VerifyAccountForm,
  title: 'Auth/components/VerifyAccountForm',
};
export default Story;

export const Primary = {
  args: {},
};
