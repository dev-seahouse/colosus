import { Paper, ReactTable, TableContainer, Typography } from '@bambu/react-ui';
import { createColumnHelper, getCoreRowModel } from '@tanstack/react-table';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import LegalDocumentsAction from './LegalDocumentsAction';
import ProfileSummaryAction from './ProfileSummaryAction';
import ContactMeAction from './ContactMeAction';

interface Content {
  content: string;
  description: ReactElement | string;
  action: ReactElement;
}

const columnHelper = createColumnHelper<Content>();
const data: Content[] = [
  {
    content: 'Advisor profile',
    description:
      'A summary of who you are, what you do and what you can provide your clients.',
    action: <ProfileSummaryAction />,
  },
  {
    content: 'Reasons to contact',
    description:
      'A list of unique selling propositions to convince your clients to get in touch with you.',
    action: <ContactMeAction />,
  },
  {
    content: 'Legal documents',
    description: (
      <>
        Privacy policy, terms & conditions (
        <Typography
          as="span"
          sx={(theme) => ({ color: theme.palette.error.main })}
        >
          required
        </Typography>
        )
      </>
    ),
    action: <LegalDocumentsAction />,
  },
];

export function ContentTable() {
  const columns = useMemo(
    () => [
      columnHelper.accessor('content', {
        header: 'Content',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('action', {
        header: '',
        cell: (info) => (
          <Typography align="right">{info.getValue()}</Typography>
        ),
      }),
    ],
    []
  );

  return (
    <TableContainer component={Paper}>
      <ReactTable
        options={{ data, columns, getCoreRowModel: getCoreRowModel() }}
      />
    </TableContainer>
  );
}

export default ContentTable;
