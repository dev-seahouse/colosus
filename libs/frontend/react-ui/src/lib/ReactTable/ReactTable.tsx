import type { TableProps } from '@mui/material/Table';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import type { TableOptions } from '@tanstack/react-table';
import { flexRender, useReactTable } from '@tanstack/react-table';

export interface ReactTableProps<T> extends TableProps {
  options: TableOptions<T>;
}

export function ReactTable<T>({ options, ...rest }: ReactTableProps<T>) {
  const table = useReactTable(options);

  return (
    <Table {...rest}>
      <TableHead>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableCell
                variant="head"
                key={header.id}
                width={header.getSize()}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={`row-${row.id}`}>
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={`cell-${cell.id}`}
                sx={{
                  width: cell.column.getSize(),
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ReactTable;
