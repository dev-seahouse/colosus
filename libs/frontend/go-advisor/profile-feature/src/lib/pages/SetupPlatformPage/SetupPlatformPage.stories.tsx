import type { Meta } from '@storybook/react';
import OnboardingLayout from '../../layouts/OnboardingLayout/OnboardingLayout';
import { SetupPlatformPage } from './SetupPlatformPage';

const Story: Meta<typeof SetupPlatformPage> = {
  component: OnboardingLayout,
  title: 'Profile/pages/SetupPlatformPage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <SetupPlatformPage />,
    },
  },
};
