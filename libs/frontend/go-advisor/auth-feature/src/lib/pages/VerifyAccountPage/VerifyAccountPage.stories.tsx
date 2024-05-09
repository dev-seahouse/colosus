import type { Meta } from '@storybook/react';
import LayoutWithBackground from '../../layouts/LayoutWithBackground/LayoutWithBackground';
import { VerifyAccountPage } from './VerifyAccountPage';

const Story: Meta<typeof VerifyAccountPage> = {
  component: LayoutWithBackground,
  title: 'Auth/pages/VerifyAccountPage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <VerifyAccountPage />,
    },
  },
};
