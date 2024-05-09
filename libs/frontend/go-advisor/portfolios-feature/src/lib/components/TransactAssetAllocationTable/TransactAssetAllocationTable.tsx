import {
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@bambu/react-ui';
import AddIcon from '@mui/icons-material/Add';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { ConfigurePortfolioFormState } from '../ConfigurePortfolioForm/ConfigurePortfolioForm.types';
import React from 'react';
import TransactAssetAllocationTotalWeight from '../TransetAssetAllocationTableTotalWeight/TransactAssetAllocationTotalWeight';
import type { TransactAssetAllocationItem } from './TransactAssetAllocationTable.types';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import TransactAssetAllocationTableRow from '../TransactAssetAllocationTableRow/TransactAssetAllocationTableRow';

export const columns = [
  { id: 'ticker', label: 'Ticker', width: 50 },
  { id: 'name', label: 'Name', width: '' },
  { id: 'currency', label: 'Currency', width: 80 },
  { id: 'type', label: 'Type', width: 140 },
  { id: 'weightage', label: 'Weightage', width: 40 },
  { id: 'actions', label: '', width: 10 },
];

export const EMPTY_FIELD = '-';

export function TransactAssetAllocationTable() {
  const isFetchingTransactPortfolios = useIsFetching({
    queryKey: ['getTransactModelPortfolios'],
  });
  const isMutatingInstruments = useIsMutating({
    mutationKey: ['createTransactPortfolioInstruments'],
  });

  const { control } = useFormContext<ConfigurePortfolioFormState>();
  const { fields, remove, append, update } = useFieldArray({
    control: control,
    name: 'transact.instruments',
  });
  const [cashField, ...rest] = fields;

  function handleOptionSelected(index: number) {
    return (v: Omit<TransactAssetAllocationItem, 'weightage'>) => {
      if (fields.map((f) => f.name).includes(v.name)) {
        throw new Error(
          'Duplicate instrument error, if this happens, check InstrumentSearchInput.tsx.'
        );
      }
      update(index + 1, { ...v, weightage: null });
      // update weight
    };
  }

  return (
    <TableContainer>
      <Table size={'small'}>
        <TableHead>
          <TableRow>
            {columns.map((c) => (
              <TableCell key={c.id} variant={'head'} width={c.width}>
                <Typography variant={'body2'}>{c.label}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isMutatingInstruments ||
          isFetchingTransactPortfolios ||
          !cashField ? (
            <TableRow>
              <TableCell colSpan={6}>
                <Skeleton variant={'rectangular'} height={'40px'}></Skeleton>
              </TableCell>
            </TableRow>
          ) : (
            <>
              <TransactAssetAllocationTableRow
                data={cashField}
                control={control}
                index={0}
                allowDelete={false}
              />
              {React.Children.toArray(
                rest.map((row, index) => (
                  <TransactAssetAllocationTableRow
                    data={row}
                    control={control}
                    showSearch={row.name === EMPTY_FIELD}
                    index={index + 1}
                    onDeleteClick={() => remove(index + 1)}
                    onOptionSelected={handleOptionSelected(index)}
                  />
                ))
              )}
            </>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell />
            <TableCell colSpan={2}>
              <Button
                disableRipple
                variant="text"
                startIcon={<AddIcon />}
                sx={{ pl: 0 }}
                onClick={() => {
                  append({
                    instrumentId: EMPTY_FIELD,
                    ticker: EMPTY_FIELD,
                    name: EMPTY_FIELD,
                    currency: EMPTY_FIELD,
                    type: EMPTY_FIELD,
                    weightage: null,
                  });
                }}
              >
                Add product
              </Button>
            </TableCell>
            <TransactAssetAllocationTotalWeight />
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default TransactAssetAllocationTable;
