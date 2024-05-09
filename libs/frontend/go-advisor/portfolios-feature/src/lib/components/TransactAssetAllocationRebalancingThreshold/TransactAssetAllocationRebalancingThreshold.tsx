import { PercentageField, Stack, Typography } from '@bambu/react-ui';
import { Controller, useFormContext } from 'react-hook-form';

export function TransactAssetAllocationRebalancingThreshold() {
  const methods = useFormContext();

  return (
    <Stack spacing={2}>
      <Typography variant={'subtitle1'} fontWeight={700}>
        Rebalancing Threshold
      </Typography>
      <Controller
        name={'transact.rebalancingThreshold'}
        control={methods.control}
        render={({ field: { onChange, ...rest }, fieldState: { error } }) => {
          return (
            <PercentageField
              {...rest}
              label="Rebalancing Threshold (%)"
              allowNegative={false}
              decimalScale={0}
              onValueChange={(e) => onChange(e.floatValue)}
              error={!!error}
              disabled
              helperText={error?.message}
            />
          );
        }}
      />
    </Stack>
  );
}

export default TransactAssetAllocationRebalancingThreshold;
