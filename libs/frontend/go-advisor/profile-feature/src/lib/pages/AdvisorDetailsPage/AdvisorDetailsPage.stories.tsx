import type { Meta } from '@storybook/react';
import OnboardingLayout from '../../layouts/OnboardingLayout/OnboardingLayout';
import { AdvisorDetailsPage } from './AdvisorDetailsPage';

const Story: Meta<typeof AdvisorDetailsPage> = {
  component: OnboardingLayout,
  title: 'Profile/pages/AdvisorDetailsPage',
};
export default Story;

export const Default = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <AdvisorDetailsPage />,
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
