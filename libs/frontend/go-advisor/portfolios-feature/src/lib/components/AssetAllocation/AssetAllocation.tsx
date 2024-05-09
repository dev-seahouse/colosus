import {
  // Button,
  Checkbox,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Stack,
} from '@bambu/react-ui';
import {
  useFieldArray,
  useFormContext,
  useWatch,
  Controller,
} from 'react-hook-form';
import { AssetAllocationPieChart } from '@bambu/go-goal-settings-feature';

import PortfolioSection from '../PortfolioSection/PortfolioSection';
import { useState } from 'react';
import type { ConfigurePortfolioFormState } from '../ConfigurePortfolioForm/ConfigurePortfolioForm.types';
// import RestorePortfolioDefaultSettingsDialog from '../RestorePortfolioDefaultSettingsDialog/RestorePortfolioDefaultSettingsDialog';

export function AssetAllocation() {
  const [restoreSettingsDialogOpen, setRestoreSettingsDialogOpen] =
    useState(false);
  const {
    control,
    formState: { isDirty },
    register,
    reset,
  } = useFormContext<ConfigurePortfolioFormState>();

  const { fields } = useFieldArray({
    control: control,
    name: 'assetClassAllocation',
  });
  const assetAllocationValues = useWatch({
    name: 'assetClassAllocation',
    control,
  });
  const invalidAssetAllocation = assetAllocationValues?.every(
    ({ included }) => !included
  );
  const totalWeight = invalidAssetAllocation
    ? 0
    : assetAllocationValues
        ?.filter((x) => x.included)
        ?.map((x) => Number(x.percentOfPortfolio))
        ?.reduce((sum, currentValue) => sum + currentValue);
  const invalidTotalWeight = totalWeight !== 100;

  const handleToggleRestoreSettingsDialog = () => {
    setRestoreSettingsDialogOpen(!restoreSettingsDialogOpen);
  };
  const handleRestoreSettings = () => {
    reset();
    handleToggleRestoreSettingsDialog();
  };
  return (
    <PortfolioSection title="Asset Allocation">
      <Stack spacing={2}>
        <Typography>
          To safeguard your secret advisory sauces, your robo-advisor only
          presents the asset allocation of each portfolio. Details such as the
          portfolio’s underlying funds can be shared in further communications
          with the client.
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-around"
        >
          <Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{ '& > th:last-child': { textAlign: 'center' } }}
                  >
                    <TableCell>Assets</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={invalidTotalWeight ? 'error' : 'default'}
                      >
                        Distribution (%)
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={invalidAssetAllocation ? 'error' : 'default'}
                      >
                        Included
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map(({ id, assetClass }, index) => (
                    <TableRow key={id}>
                      <TableCell component="th" scope="row">
                        {assetClass}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <TextField
                          key={id}
                          error={invalidTotalWeight}
                          variant="filled"
                          {...register(
                            `assetClassAllocation.${index}.percentOfPortfolio`
                          )}
                          inputProps={{
                            'data-testid': 'percent-of-portfolio-input',
                          }}
                          sx={{
                            width: 64,
                            '& .MuiFilledInput-input': {
                              py: '0.25rem',
                              px: '0.5rem',
                            },
                          }}
                          type="number"
                        />
                      </TableCell>
                      <TableCell component="th" scope="row" align="center">
                        <Controller
                          name={`assetClassAllocation.${index}.included`}
                          control={control}
                          render={({ field }) => (
                            <FormControl {...field}>
                              <Checkbox
                                checked={field.value}
                                sx={
                                  invalidAssetAllocation
                                    ? {
                                        color: '#ba1a1a',
                                      }
                                    : null
                                }
                              />
                            </FormControl>
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell align="right" sx={{ border: 'none' }}>
                      <Typography
                        sx={{ fontSize: '0.875rem' }}
                        color={invalidTotalWeight ? 'error' : 'default'}
                      >
                        Total Weight:
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ border: 'none' }}>
                      <Typography
                        sx={{ fontSize: '0.875rem' }}
                        color={invalidTotalWeight ? 'error' : 'default'}
                      >
                        {totalWeight}%
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {invalidAssetAllocation ? (
                      <TableCell colSpan={3}>
                        <Typography
                          sx={{ fontSize: '0.75rem' }}
                          color="error"
                          textAlign="center"
                        >
                          At least one asset must be included.
                        </Typography>
                      </TableCell>
                    ) : invalidTotalWeight ? (
                      <TableCell colSpan={3}>
                        <Typography
                          sx={{ fontSize: '0.75rem' }}
                          color="error"
                          textAlign="center"
                        >
                          Total weight must equal 100%
                        </Typography>
                      </TableCell>
                    ) : (
                      <TableCell colSpan={3} />
                    )}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
          <Stack>
            <AssetAllocationPieChart
              data={assetAllocationValues || []}
              variant="circle"
            />
          </Stack>
        </Stack>
      </Stack>
      {/*<Button*/}
      {/*  disabled={!isDirty}*/}
      {/*  onClick={handleToggleRestoreSettingsDialog}*/}
      {/*  variant="text"*/}
      {/*  sx={{ alignItems: 'center', gap: '0.25rem' }}*/}
      {/*>*/}
      {/*  <HistoryIcon sx={{ fontSize: '1.125rem' }} />*/}
      {/*  <Typography>Restore system settings</Typography>*/}
      {/*</Button>*/}
      {/*<RestorePortfolioDefaultSettingsDialog*/}
      {/*  open={restoreSettingsDialogOpen}*/}
      {/*  handleClose={handleToggleRestoreSettingsDialog}*/}
      {/*  handleRestoreSettings={handleRestoreSettings}*/}
      {/*/>*/}
    </PortfolioSection>
  );
}

export default AssetAllocation;
