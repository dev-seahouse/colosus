import type { Meta } from '@storybook/react';
import { OnboardingLayout } from './OnboardingLayout';

const Story: Meta<typeof OnboardingLayout> = {
  component: OnboardingLayout,
  title: 'Profile/layouts/OnboardingLayout',
};
export default Story;

export const Default = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <p>Sub-route goes here</p>,
    },
    reactQuery: {
      enableDevtools: true,
      setQueryData: {
        queryKey: 'getProfileDetails',
        data: {
          username: 'matius@bambu.co',
          firstName: null,
        },
      },
    },
  },
};
