import type { Meta } from '@storybook/react';
import { DashboardPage } from '@bambu/go-advisor-core';
import { ContactMePage } from './ContactMePage';

const Story: Meta<typeof ContactMePage> = {
  component: DashboardPage,
  title: 'Content/pages/ContactMePage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <ContactMePage />,
      routePath: '/dashboard/content/reasons-to-contact-me',
    },
  },
};
