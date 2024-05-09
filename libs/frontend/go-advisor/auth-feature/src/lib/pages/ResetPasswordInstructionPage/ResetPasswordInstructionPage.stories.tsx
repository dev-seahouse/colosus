import type { Meta } from '@storybook/react';
import LayoutWithBackground from '../../layouts/LayoutWithBackground/LayoutWithBackground';
import { ResetPasswordInstructionPage } from './ResetPasswordInstructionPage';

const Story: Meta<typeof ResetPasswordInstructionPage> = {
  component: LayoutWithBackground,
  title: 'Auth/pages/ResetPasswordInstructionPage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <ResetPasswordInstructionPage />,
    },
  },
};
