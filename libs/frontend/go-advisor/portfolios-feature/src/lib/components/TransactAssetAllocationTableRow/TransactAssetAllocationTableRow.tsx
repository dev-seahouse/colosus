import type { TransactAssetAllocationItem } from '../TransactAssetAllocationTable/TransactAssetAllocationTable.types';
import type { ConfigurePortfolioFormState } from '../ConfigurePortfolioForm/ConfigurePortfolioForm.types';
import { IconButton, TableCell, TableRow } from '@bambu/react-ui';
import InstrumentsSearchInput from '../InstrumentsSearchInput/InstrumentsSearchInput';
import RHFNumberField from '../RHFNumberField/RHFNumberField';
import TrashIcon from '../ConfigurePortfolioForm/TrashIcon';
import { EMPTY_FIELD } from '../TransactAssetAllocationTable/TransactAssetAllocationTable';
import { useFormContext, type Control } from 'react-hook-form';

export function TransactAssetAllocationTableRow({
  data,
  control,
  allowDelete = true,
  onDeleteClick,
  onOptionSelected,
  index,
}: {
  data: TransactAssetAllocationItem;
  control: Control<ConfigurePortfolioFormState>;
  allowDelete?: boolean;
  showSearch?: boolean;
  onDeleteClick?: () => void;
  onOptionSelected?: (
    v: Omit<TransactAssetAllocationItem, 'weightage'>
  ) => void;
  index: number;
}) {
  const methods = useFormContext();

  async function updateTotalWeight() {
    const instruments = await methods.getValues('transact.instruments');
    const totalWeight = instruments.reduce(
      (acc: number, instrument: { weightage: number | null }) =>
        acc + (instrument.weightage || 0),
      0
    );
    methods.setValue('transact.totalWeight', totalWeight, {
      shouldValidate: true,
    });
  }

  async function handleDeleteClick() {
    onDeleteClick && onDeleteClick();
    await updateTotalWeight();
  }

  return (
    <TableRow>
      <TableCell>{data?.ticker}</TableCell>
      <TableCell>
        {data?.name === EMPTY_FIELD ? (
          <InstrumentsSearchInput
            onSelected={onOptionSelected}
            name={`transact.instruments.${index}.inputData`}
          />
        ) : (
          data?.name
        )}
      </TableCell>
      <TableCell>{data?.currency}</TableCell>
      <TableCell>{data?.type}</TableCell>
      <TableCell>
        <RHFNumberField
          control={control}
          name={`transact.instruments.${index}.weightage`}
          variant={'filled'}
          onValueChange={updateTotalWeight}
          size={'small'}
          isAllowed={(values) => {
            const { floatValue, formattedValue } = values;
            if (floatValue == null) {
              return formattedValue === '';
            } else {
              return floatValue <= 100;
            }
          }}
        />
      </TableCell>
      {allowDelete ? (
        <TableCell>
          <IconButton onClick={handleDeleteClick}>
            <TrashIcon />
          </IconButton>
        </TableCell>
      ) : null}
    </TableRow>
  );
}

export default TransactAssetAllocationTableRow;
