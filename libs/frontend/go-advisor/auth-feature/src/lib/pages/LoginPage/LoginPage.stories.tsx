import type { Meta } from '@storybook/react';
import LayoutWithBackground from '../../layouts/LayoutWithBackground/LayoutWithBackground';
import { LoginPage } from './LoginPage';

const Story: Meta<typeof LoginPage> = {
  component: LayoutWithBackground,
  title: 'Auth/pages/LoginPage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <LoginPage />,
    },
  },
};
