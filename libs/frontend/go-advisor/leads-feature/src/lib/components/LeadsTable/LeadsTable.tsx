import { useReducer, useState } from 'react';
import {
  Box,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@bambu/react-ui';
import type {
  ColumnDef,
  FiltersTableState,
  OnChangeFn,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import type { TLeadsItem } from '@bambu/api-client';
import LeadsTableRowDetails from '../LeadsTableRowDetails/LeadsTableRowDetails';
import NoData from '../NoData/NoData';
import LeadsTableRowDetailsButton from '../LeadsTableRowDetailsButton/LeadsTableRowDetailsButton';

export interface LeadsTableProps<TData> {
  // column definitions
  columns: ColumnDef<TData, any>[];
  // data from api
  data: TData[];
  isLoading?: boolean;
  // temporarily marked optional until implemented
  sorting?: SortingState;
  // temporarily marked optional until implemented
  onSortingChange?: OnChangeFn<SortingState>; // state updater
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>; // state updater
  // for search feature
  globalFilter: string | number;
  onGlobalFilterChange: OnChangeFn<FiltersTableState['globalFilter']>; // state updater
  // total number of pages with/without filters + search applied
  pageCount: number;
  // total number of items in database with/without filters + search applied
  totalCount: number;
}

/*
 If you do not know how many pages there are, you can set this to -1.
 https://tanstack.com/table/v8/docs/api/features/pagination#pagecount
*/
const UNKNOWN_PAGE_COUNT = -1;

// probably store this somewhere else but where?
const DEFAULT_PAGE_SIZE = 10;

export function LeadsTable<TData extends object>({
  data,
  columns,
  pagination,
  onPaginationChange,
  sorting,
  pageCount,
  totalCount,
  onSortingChange,
  globalFilter,
  onGlobalFilterChange,
  isLoading,
}: LeadsTableProps<TData>) {
  const { getHeaderGroups, getRowModel, getState, setPageIndex, setPageSize } =
    useReactTable({
      data,
      columns,
      state: {
        sorting,
        pagination,
        globalFilter,
      },
      getCoreRowModel: getCoreRowModel(),
      manualPagination: true,
      onPaginationChange,
      pageCount: pageCount || UNKNOWN_PAGE_COUNT,
      manualSorting: true,
      manualFiltering: true,
      onGlobalFilterChange,
      onSortingChange,
      debugTable: true,
    });

  const [isRowDetailsOpen, toggleRowDetailsOpen] = useReducer((state) => {
    return !state;
  }, false);

  const [uuid, setUuid] = useState<string>('');
  const { pageSize, pageIndex } = getState().pagination;

  function handleRowDetailsButtonClick(id: string) {
    setUuid(id);
    toggleRowDetailsOpen();
  }

  return (
    <Box>
      <TableContainer component={'div'}>
        {isLoading ? (
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        ) : null}
        <Table>
          {data?.length ? (
            <TableHead>
              {getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      variant="head"
                      key={header.id}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      <TableSortLabel
                        hideSortIcon={!header.column.getCanSort()}
                        direction={header.column.getIsSorted() || undefined}
                        active={header.column.getCanSort()}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  {/* actions */}
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </TableHead>
          ) : null}

          <TableBody>
            {!data || !getRowModel().rows.length ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="justify"
                  sx={{ borderBottom: 'none' }}
                >
                  <NoData />
                </TableCell>
              </TableRow>
            ) : (
              getRowModel().rows.map((row) => (
                <TableRow key={`row-${row.id}`}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={`cell-${cell.id}`}
                      sx={{
                        width:
                          cell.column.getSize() === Number.MAX_SAFE_INTEGER
                            ? 'auto'
                            : cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell sx={{ pr: '14px', pl: 0 }}>
                    <LeadsTableRowDetailsButton
                      onClick={() =>
                        handleRowDetailsButtonClick(
                          (row.original as TLeadsItem).id
                        )
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {getRowModel().rows.length ? (
        <TablePagination
          component="div"
          SelectProps={{
            inputProps: {
              'aria-label': 'rows per page',
            },
          }}
          count={totalCount}
          rowsPerPage={pageSize}
          page={pageIndex}
          onPageChange={(_, page) => {
            setPageIndex(page);
          }}
          onRowsPerPageChange={(e) => {
            const { value } = e.target;
            const newPageSize = value ? Number(value) : DEFAULT_PAGE_SIZE;
            setPageSize(newPageSize);
          }}
        />
      ) : null}
      {data?.length && isRowDetailsOpen ? (
        <LeadsTableRowDetails
          open={isRowDetailsOpen}
          toggleDrawerOpen={toggleRowDetailsOpen}
          id={uuid}
        />
      ) : null}
      {/*<pre>{JSON.stringify(getState().pagination, null, 2)}</pre>*/}
    </Box>
  );
}

export default LeadsTable;
