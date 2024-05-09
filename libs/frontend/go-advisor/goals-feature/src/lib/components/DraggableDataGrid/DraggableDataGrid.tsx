import { Paper, Table, TableBody, TableContainer } from '@bambu/react-ui';
import { useId, Children, isValidElement } from 'react';
import type { ReactNode, ReactElement } from 'react';
import type {
  OnBeforeCaptureResponder,
  OnBeforeDragStartResponder,
  OnDragEndResponder,
  OnDragStartResponder,
  OnDragUpdateResponder,
} from '@hello-pangea/dnd';
import { Droppable } from '@hello-pangea/dnd';
import { DragDropContext } from '@hello-pangea/dnd';
import DraggableDataGridRow from './DraggableDataGridRow';
import DraggableDataGridCell from './DraggabledataGridCell';

interface Responders {
  onBeforeCapture?: OnBeforeCaptureResponder;
  onBeforeDragStart?: OnBeforeDragStartResponder;
  onDragStart?: OnDragStartResponder;
  onDragUpdate?: OnDragUpdateResponder;
  onDragEnd: OnDragEndResponder;
}

export interface DraggableDataGridProps extends Responders {
  children: ReactNode;
}
export function DraggableDataGrid({
  children,
  onDragEnd,
  onBeforeCapture,
  onDragStart,
  onDragUpdate,
}: DraggableDataGridProps) {
  const droppableId = useId();

  const [headerItems, draggableRowItems, remainingItems] = splitChildrenByType(
    Children.toArray(children)
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <>
          {headerItems}
          <DragDropContext
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            onBeforeCapture={onBeforeCapture}
            onDragUpdate={onDragUpdate}
          >
            <Droppable droppableId={droppableId}>
              {({ innerRef, droppableProps, placeholder }) => (
                <TableBody ref={innerRef} {...droppableProps}>
                  <>
                    {draggableRowItems}
                    {placeholder}
                  </>
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
          {remainingItems}
        </>
      </Table>
    </TableContainer>
  );
}

DraggableDataGrid.Row = DraggableDataGridRow;
DraggableDataGrid.Cell = DraggableDataGridCell;
export default DraggableDataGrid;

/**
 * @param arr React children
 * @returns 3 arrays :
 *  1. first array contains elements before DraggableGridRow
 *  2. second array contains DraggableGridRow
 *  3. last array contains remaining elements
 */
function splitChildrenByType<T extends ReactNode>(
  arr: T[] | undefined | null
): [T[], T[], T[]] {
  const headerItems: T[] = [];
  const rowItems: T[] = [];
  const remainingItems: T[] = [];

  if (arr) {
    let i = 0;
    while (i < arr.length && !hasType(arr[i], DraggableDataGridRow.name)) {
      headerItems.push(arr[i]);
      i++;
    }
    while (i < arr.length && hasType(arr[i], DraggableDataGridRow.name)) {
      rowItems.push(arr[i]);
      i++;
    }
    remainingItems.push(...arr.slice(i));
  }

  return [headerItems, rowItems, remainingItems];
}

function isReactElement(element: unknown): element is ReactElement {
  if (!isValidElement(element))
    throw new Error(`Element "${element}" is not a valid ReactElement`);
  // valid react element objects always have a type property
  return typeof element === 'object' && 'type' in element;
}

/**
 * checks if node.type === typeName
 * @param node any react node
 * @param typeName
 * returns true | false
 */
function hasType(node: ReactNode, typeName: string): boolean {
  if (!isReactElement(node)) return false;
  if (typeof node.type === 'string') return false;
  if (node.type.name !== typeName) return false;
  return true;
}
