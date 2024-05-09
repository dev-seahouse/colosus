import React, { useCallback, useState } from 'react';
import { reOrder } from '../utils/reOrder';
import type { OnDragEndResponder } from 'react-beautiful-dnd';
import DraggableDataGrid from '../DraggableDataGrid';
import { TableCell, TableHead, TableRow } from '@bambu/react-ui';

export function DraggableDataGridExample() {
  const [data, setData] = useState([
    { id: 1, data1: 'row 1 data 1', data2: 'row 1 data 2', on: true },
    { id: 2, data1: 'row 2 data 1', data2: 'row 2 data 2', on: false },
    { id: 3, data1: 'row 3 data 1', data2: 'row 3 data 2', on: true },
  ]);

  const onDragEnd = useCallback((result) => {
    // dropped outside the list
    if (!result?.destination?.index) {
      return;
    }

    // no movement
    if (result.destination.index === result.source.index) {
      return;
    }

    // update goals order of display
    setData((data) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      reOrder(data, result.source.index, result.destination!.index)
    );
  }, []) satisfies OnDragEndResponder;

  return (
    <DraggableDataGrid onDragEnd={onDragEnd}>
      <colgroup>
        <col style={{ width: '5%' }} />
        <col style={{ width: '150px' }} />
      </colgroup>
      <TableHead sx={{ userSelect: 'none' }}>
        <TableRow>
          <TableCell>id</TableCell>
          <TableCell>Row A</TableCell>
          <TableCell>Row B</TableCell>
        </TableRow>
      </TableHead>

      {data.map(({ id, data1, data2, on }, index) => (
        <DraggableDataGrid.Row id={`${id}`} key={id} rowIndex={index}>
          <DraggableDataGrid.Cell>{id}</DraggableDataGrid.Cell>
          <DraggableDataGrid.Cell>{data1}</DraggableDataGrid.Cell>
          <DraggableDataGrid.Cell>{data2}</DraggableDataGrid.Cell>
        </DraggableDataGrid.Row>
      ))}
    </DraggableDataGrid>
  );
}
