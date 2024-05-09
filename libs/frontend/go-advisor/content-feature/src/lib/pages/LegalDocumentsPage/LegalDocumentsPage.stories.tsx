import type { Meta } from '@storybook/react';
import { DashboardPage } from '@bambu/go-advisor-core';
import { LegalDocumentsPage } from './LegalDocumentsPage';

const Story: Meta<typeof LegalDocumentsPage> = {
  component: DashboardPage,
  title: 'Content/pages/LegalDocumentsPage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <LegalDocumentsPage />,
      routePath: '/dashboard/content/legal-documents',
    },
  },
};
