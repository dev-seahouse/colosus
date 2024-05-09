import {
  Grid,
  PercentageField,
  Stack,
  TextField,
  Typography,
} from '@bambu/react-ui';
import { Controller, useFormContext } from 'react-hook-form';
import SettingsFormCard from '../SettingsForm/SettingsFormCard';
import SettingsFormTitle from '../SettingsForm/SettingsFormTitle';
import { PatternFormat } from 'react-number-format';

import type { SettingsFormState } from '../SettingsForm/SettingsForm';

export const RoboManagementFeeSettings = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<SettingsFormState>();

  return (
    <SettingsFormCard data-testid="advisory-service-settings">
      <Grid spacing={3} container>
        <Grid item xs={6}>
          <Stack spacing={2}>
            <SettingsFormTitle>Robo-advisor management fee</SettingsFormTitle>
            <Stack spacing={4}>
              <Typography>
                Management fee is paid to you monthly by our UK-based
                custodian–Wealth Kernel. The amount is calculated based on a
                percentage of the AUM that you manage using Bambu GO.
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack spacing={2}>
            <Stack spacing={1}>
              <Controller
                render={({ field: { onChange, value, onBlur } }) => (
                  <PercentageField
                    sx={{ width: '100%' }}
                    allowNegative={false}
                    label="Annual Management Fee"
                    placeholder="Annual Management Fee"
                    value={value}
                    onBlur={onBlur}
                    onValueChange={(e) => onChange(e.floatValue ?? '')}
                    error={!!errors.annualManagementFee}
                    helperText={errors.annualManagementFee?.message}
                  />
                )}
                control={control}
                name="annualManagementFee"
              />
              <Typography variant="subtitle2">
                Monthly fee payable to you = 0.41% of AUM per month
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <Typography>
                Enter your company’s bank account details to receive your
                management fee:
              </Typography>
              <Controller
                name={'accountNumber'}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    inputProps={{
                      'data-testid': 'accountNumber',
                      id: 'accountNumber',
                    }}
                    InputLabelProps={{
                      htmlFor: 'accountNumber',
                    }}
                    placeholder="Account number"
                    label={'Account number'}
                    name="accountNumber"
                    error={!!errors.accountNumber}
                    helperText={errors.accountNumber?.message}
                  />
                )}
              />
              <Controller
                name={'sortCode'}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <PatternFormat
                    format="##-##-##"
                    customInput={TextField}
                    {...field}
                    label="Sort code"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                name={'accountName'}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    inputProps={{
                      'data-testid': 'accountName',
                      id: 'accountName',
                    }}
                    label={'Account name'}
                    InputLabelProps={{
                      htmlFor: 'accountName',
                    }}
                    placeholder="Account name"
                    error={!!error}
                    helperText={error?.message}
                    {...field}
                  />
                )}
              />
              <Typography variant="subtitle2">
                This should match the name that appears on your company’s bank
                account
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </SettingsFormCard>
  );
};

export default RoboManagementFeeSettings;
