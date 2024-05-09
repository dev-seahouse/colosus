import { Controller, useFormContext } from 'react-hook-form';
import type { ConfigurePortfolioFormState } from '../ConfigurePortfolioForm/ConfigurePortfolioForm.types';
import { TableCell, Typography } from '@bambu/react-ui';
import { NumericFormat } from 'react-number-format';

export default TransactAssetAllocationTotalWeight;

export function TransactAssetAllocationTotalWeight() {
  const {
    control,
    formState: { errors },
  } = useFormContext<ConfigurePortfolioFormState>();

  return (
    <>
      <TableCell colSpan={1}>
        <Typography
          variant="body2"
          color={errors?.transact?.totalWeight ? 'error' : '#191c1b'}
        >
          Total Weightage:
        </Typography>
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name={'transact.totalWeight'}
          render={({ field, fieldState: { error } }) => {
            return (
              <Typography variant="body2" color={error ? 'error' : '#191c1b'}>
                <NumericFormat
                  displayType={'text'}
                  suffix={'%'}
                  decimalScale={0}
                  value={field.value}
                  allowNegative={false}
                />
              </Typography>
            );
          }}
        />
      </TableCell>
    </>
  );
}
