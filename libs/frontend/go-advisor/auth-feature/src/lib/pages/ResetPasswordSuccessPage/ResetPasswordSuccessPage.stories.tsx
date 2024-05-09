import type { Meta } from '@storybook/react';
import LayoutWithBackground from '../../layouts/LayoutWithBackground/LayoutWithBackground';
import { ResetPasswordSuccessPage } from './ResetPasswordSuccessPage';

const Story: Meta<typeof ResetPasswordSuccessPage> = {
  component: LayoutWithBackground,
  title: 'Auth/pages/ResetPasswordSuccessPage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <ResetPasswordSuccessPage />,
    },
  },
};
