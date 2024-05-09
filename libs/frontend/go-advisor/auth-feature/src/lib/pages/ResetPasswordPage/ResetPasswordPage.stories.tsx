import type { Meta } from '@storybook/react';
import LayoutWithBackground from '../../layouts/LayoutWithBackground/LayoutWithBackground';
import { ResetPasswordPage } from './ResetPasswordPage';

const Story: Meta<typeof ResetPasswordPage> = {
  component: LayoutWithBackground,
  title: 'Auth/pages/ResetPasswordPage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    outlet: <ResetPasswordPage />,
  },
};
