import type { TableCellProps } from '@bambu/react-ui';
import { TableCell } from '@bambu/react-ui';
import useLayoutDimensions from '../ConfigureGoalsDataGrid/hooks/useLayoutDimensions';

export interface DraggableTableCellProps extends TableCellProps {
  isDragging?: boolean;
}

function DraggableDataGridCell({
  isDragging,
  sx,
  ...props
}: DraggableTableCellProps) {
  /**
   * useLayoutDimensions() prevents table cells from shrinking when dragging starts.
   * react-beautiful-dnd changes the 'position' to 'fixed' when dragging starts
   * this causes table cells to lose its dimensions.
   * therefore dimensions of cells need to be recorded before dragging triggers
   * re-render, and when drag starts, restore the original dimensions
   */
  const [ownRef, getLockedDimensions] = useLayoutDimensions(isDragging);

  return (
    <TableCell
      ref={ownRef}
      sx={{ ...sx, userSelect: 'none', ...getLockedDimensions() }}
      {...props}
    />
  );
}

export default DraggableDataGridCell;
