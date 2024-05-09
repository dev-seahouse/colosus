import type { TLeadsItem } from '@bambu/api-client';
import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { styled } from '@bambu/react-ui';
import { toTitleCase } from '../LeadsTableRowDetails/utils';

const EmailLink = styled('a')(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
}));

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

interface EmailCellProps {
  getValue: () => string;
}

const EmailCell = ({ getValue }: EmailCellProps) => {
  const value = getValue();
  return <EmailLink href={`mailto:${value}`}>{value}</EmailLink>;
};

const columnHelper = createColumnHelper<TLeadsItem>();

// removing :ColumnDef causes "Exported Variable <x> has or is using name <y>
// from external module but cannot be named error"
export const columns: ColumnDef<TLeadsItem, any>[] = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (props) => props.getValue(),
    enableSorting: true,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: ({ getValue }) => <EmailCell getValue={getValue} />,
    enableSorting: false,
  }),
  columnHelper.accessor('phoneNumber', {
    header: 'Phone Number',
    cell: (props) => props.getValue(),
    enableSorting: false,
  }),
  columnHelper.accessor('incomePerAnnum', {
    header: 'Annual Income',
    cell: (props) => formatter.format(props.getValue()),
    enableSorting: true,
  }),
  columnHelper.accessor('currentSavings', {
    header: 'Cash Savings',
    cell: (props) => formatter.format(props.getValue()),
    enableSorting: true,
  }),
  columnHelper.accessor('status', {
    header: 'Lead Status',
    cell: (props) => toTitleCase(props.getValue()),
    enableSorting: true,
    size: 80,
  }),
  // columnHelper.display({
  //   id: 'actions',
  //   cell: (props) => <LeadsTableRowDetailsButton {...props} />,
  // }),
];
