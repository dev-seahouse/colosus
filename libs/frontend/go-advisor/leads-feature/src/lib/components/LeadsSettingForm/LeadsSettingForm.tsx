import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Button,
  Form,
  Card,
  CardContent,
  Slider,
  CurrencyField,
  Box,
  Stack,
  Grid,
  MuiLink,
  enqueueSnackbar,
  closeSnackbar,
  SnackbarCloseButton,
} from '@bambu/react-ui';
import { z } from 'zod';
import LeadsSettingDivider from '../LeadsSettingDivider/LeadsSettingDivider';
import LeadsSettingHeader from '../LeadsSettingHeader/LeadsSettingHeader';
import { useUpdateTopLevelOptions } from '@bambu/go-advisor-core';
import { useNavigate } from 'react-router-dom';

const minimumIncomeSliderMarks = [
  { value: 0, label: '$0' },
  { value: 250000, label: '250k' },
  { value: 500000, label: '500k' },
  { value: 750000, label: '750k' },
  { value: 1000000, label: '1M' },
];

const minimumCashSavingsSliderMarks = [
  { value: 0, label: '$0' },
  { value: 1000000, label: '1M' },
  { value: 2000000, label: '2M' },
  { value: 3000000, label: '3M' },
  { value: 4000000, label: '4M' },
  { value: 5000000, label: '5M' },
];

const MINIMUM_INCOME_MIN = 0;
const MINIMUM_INCOME_MAX = 1000000;
const MINIMUM_INCOME_STEP = MINIMUM_INCOME_MAX / 50;

const MINIMUM_CASH_SAVINGS_MIN = 0;
const MINIMUM_CASH_SAVINGS_MAX = 5000000;
const CASH_SAVINGS_STEP = MINIMUM_CASH_SAVINGS_MAX / 50;

const leadsSettingFormSchema = z.object({
  minimumAnnualIncome: z
    .number({
      required_error: 'Minimum annual income must be $0 or higher.',
    })
    .min(MINIMUM_INCOME_MIN, 'Minimum annual income must be $0 or higher.')
    .max(MINIMUM_INCOME_MAX, 'Minimum annual income cannot exceed $1,000,000'),
  minimumCashSavings: z
    .number({
      required_error: 'Minimum cash savings must be $0 or higher',
    })
    .min(MINIMUM_CASH_SAVINGS_MIN, 'Minimum cash savings must be $0 or higher')
    .max(
      MINIMUM_CASH_SAVINGS_MAX,
      'Minimum cash savings cannot exceed $5,000,000'
    ),
});

export type LeadsSettingState = z.infer<typeof leadsSettingFormSchema>;

export interface LeadsSettingFormProps {
  initialIncomeThreshold?: number;
  initialRetireeSavingsThreshold?: number;
}

// TODO: extract useCurrencyProps and useSliderProps
export function LeadsSettingForm({
  initialIncomeThreshold = 100000,
  initialRetireeSavingsThreshold = 200000,
}: LeadsSettingFormProps) {
  const { mutate } = useUpdateTopLevelOptions();
  const navigate = useNavigate();

  const {
    formState: { errors },
    handleSubmit: rhfHandleSubmit,
    control,
  } = useForm<LeadsSettingState>({
    resolver: zodResolver(leadsSettingFormSchema),
    defaultValues: {
      minimumAnnualIncome: initialIncomeThreshold,
      minimumCashSavings: initialRetireeSavingsThreshold,
    },
    mode: 'onTouched',
  });

  const { field: minimumAnnualIncomeField } = useController({
    name: 'minimumAnnualIncome',
    control,
  });

  const { field: minimumCashSavingsField } = useController({
    name: 'minimumCashSavings',
    control,
  });

  const handleSubmit = rhfHandleSubmit((data) => {
    const { minimumAnnualIncome, minimumCashSavings } = data;

    mutate(
      {
        incomeThreshold: minimumAnnualIncome,
        retireeSavingsThreshold: minimumCashSavings,
      },
      {
        onSuccess: () => {
          enqueueSnackbar({
            message: 'Lead settings saved',
            variant: 'success',
            // need to use useNavigate because notistack provider is not within routerprovider
            action: (snackbarId) => (
              <>
                <MuiLink
                  component="button"
                  onClick={() => {
                    closeSnackbar(snackbarId);
                    navigate('../leads');
                  }}
                >
                  View leads
                </MuiLink>
                <SnackbarCloseButton snackbarKey={snackbarId} />
              </>
            ),
          });
        },
      }
    );
  });

  return (
    <Form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Card sx={{ p: 2 }}>
          <CardContent>
            <Stack spacing={3}>
              <LeadsSettingHeader />

              <Grid container gap={6}>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={5}>
                      <CurrencyField
                        sx={{
                          minWidth: '272px',
                          '.MuiFormHelperText-root': {
                            height: 0, // prevent error msg push down divs below
                          },
                        }}
                        label="Minimum annual income"
                        allowNegative={false}
                        name={minimumAnnualIncomeField.name}
                        value={minimumAnnualIncomeField.value}
                        error={!!errors.minimumAnnualIncome}
                        helperText={errors?.minimumAnnualIncome?.message}
                        onValueChange={(e) => {
                          minimumAnnualIncomeField.onChange(e.floatValue);
                        }}
                        onBlur={minimumAnnualIncomeField.onBlur}
                      />
                    </Grid>

                    <Grid item xs={7}>
                      <Slider
                        step={MINIMUM_INCOME_STEP}
                        size="big"
                        min={MINIMUM_INCOME_MIN}
                        max={MINIMUM_INCOME_MAX}
                        aria-label="Minimum annual income slider"
                        valueLabelDisplay="off"
                        marks={minimumIncomeSliderMarks}
                        name="minimumAnnualIncomeSlider"
                        value={minimumAnnualIncomeField.value ?? ''}
                        onChange={(e) => {
                          minimumAnnualIncomeField.onChange(
                            (e.target as HTMLInputElement)?.value
                          );
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <LeadsSettingDivider />
                </Grid>

                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={5}>
                      <CurrencyField
                        label="Minimum cash savings"
                        sx={{
                          minWidth: '272px',
                          '.MuiFormHelperText-root': {
                            height: 0, // prevent error from pushing down div below
                          },
                        }}
                        allowNegative={false}
                        name={minimumCashSavingsField.name}
                        value={minimumCashSavingsField.value}
                        error={!!errors.minimumCashSavings}
                        helperText={errors?.minimumCashSavings?.message}
                        onValueChange={(e) => {
                          minimumCashSavingsField.onChange(e.floatValue);
                        }}
                        onBlur={minimumCashSavingsField.onBlur}
                      />
                    </Grid>

                    <Grid item xs={7}>
                      <Slider
                        step={CASH_SAVINGS_STEP}
                        size="big"
                        aria-label="Minimum cash savings slider"
                        min={MINIMUM_CASH_SAVINGS_MIN}
                        max={MINIMUM_CASH_SAVINGS_MAX}
                        valueLabelDisplay="off"
                        marks={minimumCashSavingsSliderMarks}
                        name="minimumCashSavings"
                        value={minimumCashSavingsField.value}
                        onChange={(e) => {
                          minimumCashSavingsField.onChange(
                            (e.target as HTMLInputElement)?.value
                          );
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>

        <Box>
          <Button type="submit" size="large">
            Use this configuration
          </Button>
        </Box>
      </Stack>
    </Form>
  );
}

export default LeadsSettingForm;
