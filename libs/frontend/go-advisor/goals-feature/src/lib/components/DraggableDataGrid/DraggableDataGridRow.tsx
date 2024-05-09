import type { ReactElement } from 'react';
import { Children, cloneElement } from 'react';
import { useId } from 'react';
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import { Draggable } from '@hello-pangea/dnd';

import type { TableRowProps } from '@bambu/react-ui';
import { TableRow } from '@bambu/react-ui';
import type { DraggableTableCellProps } from './DraggabledataGridCell';
interface DraggableRowProps extends TableRowProps {
  rowIndex: number;
  children:
    | ReactElement<DraggableTableCellProps>[]
    | ReactElement<DraggableTableCellProps>;
}

const rowStyle = (
  provided: DraggableProvided,
  snapshot: DraggableStateSnapshot,
  overrideStyle?: React.CSSProperties
) => ({
  ...provided.draggableProps.style,
  cursor: snapshot.isDragging ? 'all-scroll' : 'grab',
  background: snapshot.isDragging ? 'rgba(245,245,245, 0.75)' : 'none',
  ...{
    ...(snapshot.isDropAnimating
      ? {
          transition: `all cubic-bezier(.2,1,.1,1) ${0.01}s`,
        }
      : {}),
  },
  ...overrideStyle,
});

function DraggableDataGridRow({
  id,
  rowIndex,
  style,
  children,
}: DraggableRowProps) {
  const draggableId = useId();
  const rowFocusStyle = {
    '&:focus': {
      border: '2px solid #DCDCDC',
    },
  };
  return (
    <Draggable draggableId={draggableId} key={id} index={rowIndex}>
      {(draggableProvided, draggableSnapshot) => (
        <TableRow
          ref={draggableProvided.innerRef}
          {...draggableProvided.draggableProps}
          {...draggableProvided.dragHandleProps}
          style={rowStyle(draggableProvided, draggableSnapshot, style)}
          tabIndex={0}
          sx={rowFocusStyle}
        >
          {Children.map(children, (child, index) =>
            cloneElement(child, {
              isDragging: draggableSnapshot.isDragging,
            })
          )}
        </TableRow>
      )}
    </Draggable>
  );
}

export default DraggableDataGridRow;
