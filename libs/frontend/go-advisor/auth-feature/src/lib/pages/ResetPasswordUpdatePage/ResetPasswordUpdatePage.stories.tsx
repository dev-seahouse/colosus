import type { Meta } from '@storybook/react';
import LayoutWithBackground from '../../layouts/LayoutWithBackground/LayoutWithBackground';
import { ResetPasswordUpdatePage } from './ResetPasswordUpdatePage';

const Story: Meta<typeof ResetPasswordUpdatePage> = {
  component: LayoutWithBackground,
  title: 'Auth/pages/ResetPasswordUpdatePage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <ResetPasswordUpdatePage />,
    },
  },
};
