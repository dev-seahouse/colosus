import type { Meta } from '@storybook/react';
import LayoutWithBackground from '../../layouts/LayoutWithBackground/LayoutWithBackground';
import { CreateAccountPage } from './CreateAccountPage';

const Story: Meta<typeof CreateAccountPage> = {
  component: LayoutWithBackground,
  title: 'Auth/pages/CreateAccountPage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <CreateAccountPage />,
    },
  },
};
