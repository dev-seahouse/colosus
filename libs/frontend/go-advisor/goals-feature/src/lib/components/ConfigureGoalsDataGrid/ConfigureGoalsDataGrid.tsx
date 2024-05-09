import { useCallback } from 'react';

import { registerMuiField, Switch } from '@bambu/react-ui';
import { TableHead, TableRow } from '@bambu/react-ui';
import { TableCell } from '@bambu/react-ui';
import type { OnDragEndResponder } from 'react-beautiful-dnd';
import DraggableDataGrid from '../DraggableDataGrid/DraggableDataGrid';
import LockIcon from '@mui/icons-material/Lock';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { ConfigureGoalsFormFields } from '../../sharedTypes';

export function ConfigureGoalsDataGrid() {
  const { register, control } = useFormContext<ConfigureGoalsFormFields>();
  const { fields, move } = useFieldArray({
    control: control,
    /* all switch inputs are registered/grouped under goalConfig */
    name: 'goalTypes',
  });

  const handleDragEnd = useCallback(
    (result) => {
      // dropped outside the list
      if (result?.destination == null) return;

      const indexOfOtherGoal = fields.length - 1;

      // no movement
      if (result.destination.index === result.source.index) return;

      // prevent moving other goal
      if (
        result.destination.index === indexOfOtherGoal ||
        result.source.index === indexOfOtherGoal
      )
        return;

      // updates goals order of display represented by array index
      move(result.source.index, result.destination.index);
    },
    [fields.length, move]
  ) satisfies OnDragEndResponder;

  return (
    <DraggableDataGrid onDragEnd={handleDragEnd}>
      <colgroup>
        <col style={{ width: '5%' }} />
        <col style={{ width: '140px' }} />
      </colgroup>

      <TableHead sx={{ userSelect: 'none' }}>
        <TableRow>
          <TableCell>&nbsp;</TableCell>
          <TableCell>Order of display</TableCell>
          <TableCell>Goal type</TableCell>
          <TableCell>Display?</TableCell>
        </TableRow>
      </TableHead>

      {fields.map(({ id, name, enabled }, index) => (
        <DraggableDataGrid.Row
          id={`${id}`}
          key={id}
          rowIndex={index}
          {...(isOtherGoal(name) ? { style: { cursor: 'not-allowed' } } : {})}
        >
          <DraggableDataGrid.Cell component="th" scope="row">
            {name === 'Other' ? (
              <LockIcon
                sx={{ verticalAlign: 'middle' }}
                fontSize={'medium'}
                color="disabled"
              />
            ) : (
              <DragIndicatorIcon
                sx={{ verticalAlign: 'middle' }}
                fontSize="medium"
              />
            )}
          </DraggableDataGrid.Cell>

          <DraggableDataGrid.Cell>
            {isOtherGoal(name) ? '- ' : `${index + 1}`}
          </DraggableDataGrid.Cell>

          <DraggableDataGrid.Cell>{name}</DraggableDataGrid.Cell>

          <DraggableDataGrid.Cell>
            <Switch
              inputProps={{ 'aria-label': `Switch ${name}` }}
              defaultChecked={enabled}
              disabled={isOtherGoal(name)}
              // for useFieldArray, register() takes `fieldsName[index].value`)
              {...registerMuiField(register(`goalTypes[${index}].enabled`))}
            />
          </DraggableDataGrid.Cell>
        </DraggableDataGrid.Row>
      ))}
    </DraggableDataGrid>
  );
}

export default ConfigureGoalsDataGrid;

function isOtherGoal(goalName: string) {
  return goalName === 'Other';
}
