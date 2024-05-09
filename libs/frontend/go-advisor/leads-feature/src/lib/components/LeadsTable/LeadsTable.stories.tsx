import type { Meta } from '@storybook/react';
import { LeadsTable } from './LeadsTable';
import { columns } from './LeadsTable.columns';
import { advisorLeadsMockResponse } from '@bambu/api-client';

const Story: Meta<typeof LeadsTable> = {
  component: LeadsTable,
  title: 'leads/components/LeadsTable',
};
export default Story;

export const Primary = {
  args: {
    columns: columns,
    data: advisorLeadsMockResponse.data,
    pageCount: Math.ceil(advisorLeadsMockResponse.data.length / 10),
    isLoading: false,
    pagination: {
      pageSize: 10,
      pageIndex: 0,
    },
  },
};
