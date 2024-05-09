import {
  Card,
  CardContent,
  ErrorLoadingData,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@bambu/react-ui';
import PaymentSettingsCardHeader from '../PaymentSettingsCardHeader/PaymentSettingsCardHeader';
import {
  CurrencyText,
  getDayOfTheMonthSuffix,
  SkeletonLoading,
  TwoColumnLayout,
  useGetInvestorGoalDetails,
} from '@bambu/go-core';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import { Controller, useFormContext } from 'react-hook-form';
import type { PaymentSettingsFormValues } from '../PaymentSettingsForm/PaymentSettingsForm';

/**
 * Contribution details card
 * displays contribution details
 */
export function PaymentSettingsContributionDetailsCard() {
  const { control } = useFormContext<PaymentSettingsFormValues>();
  const daysInAMonthOptions = generateDaysInMonthsOptions(1, 28);
  const { goalId } = useParams();
  const {
    data: goal,
    isLoading: isGoalLoading,
    isError: isGoalError,
    isSuccess: isGoalSuccess,
  } = useGetInvestorGoalDetails(
    { goalId: goalId ?? '' },
    { enabled: !!goalId }
  );

  if (!goalId) {
    console.error('goalId is not found');
    return (
      <Card>
        <CardContent>
          <ErrorLoadingData />
        </CardContent>
      </Card>
    );
  }

  if (isGoalLoading) {
    return <SkeletonLoading variant={'small'} />;
  }

  if (isGoalError || !isGoalSuccess) {
    console.error('get goal by id api error');
    return (
      <Card>
        <CardContent>
          <ErrorLoadingData />
        </CardContent>
      </Card>
    );
  }

  const { startDate, endDate } = getDefaultGoalStartEndDates(
    goal?.goalTimeframe ?? 0
  );

  return (
    <Card elevation={2} sx={{ pb: 2 }}>
      <CardContent>
        <PaymentSettingsCardHeader>
          Your contribution details
        </PaymentSettingsCardHeader>

        <Stack spacing={2}>
          <Stack spacing={1.8} component="section">
            <Typography fontWeight={'bold'} variant={'body2'}>
              Initial deposit
            </Typography>

            <TwoColumnLayout>
              <Typography fontWeight={300} variant={'body2'} fontSize={'12px'}>
                Amount
              </Typography>
              <Typography fontWeight={'bold'} variant={'body2'}>
                <CurrencyText value={goal?.initialInvestment ?? 0} />
              </Typography>
            </TwoColumnLayout>
          </Stack>

          {goal?.GoalRecurringSavingsPlans?.[0]?.amount ? (
            <Stack spacing={2} component={'section'}>
              <Typography fontWeight={'bold'} variant={'body2'}>
                Recurring deposit
              </Typography>
              <TwoColumnLayout>
                <Typography
                  fontWeight={300}
                  variant={'body2'}
                  fontSize={'12px'}
                >
                  Amount
                </Typography>
                <Typography fontWeight={'bold'} variant={'body2'}>
                  <CurrencyText
                    value={goal?.GoalRecurringSavingsPlans?.[0]?.amount ?? 0}
                  />
                </Typography>
              </TwoColumnLayout>

              <TwoColumnLayout>
                <Typography
                  fontWeight={300}
                  variant={'body2'}
                  fontSize={'12px'}
                >
                  Start month
                </Typography>
                <Typography fontWeight={'bold'} variant={'body2'}>
                  {getDateOrFallback(goal?.goalStartDate, startDate)}
                </Typography>
              </TwoColumnLayout>

              <TwoColumnLayout sx={{ pb: 0.3 }}>
                <Typography
                  fontWeight={300}
                  variant={'body2'}
                  fontSize={'12px'}
                >
                  End month
                </Typography>
                <Typography fontWeight={'bold'} variant={'body2'}>
                  {getDateOrFallback(goal?.goalEndDate, endDate)}
                </Typography>
              </TwoColumnLayout>

              <TwoColumnLayout sx={{ alignItems: 'center' }}>
                <Typography
                  fontWeight={300}
                  variant={'body2'}
                  fontSize={'12px'}
                >
                  Recurring payment date
                </Typography>
                <Controller
                  control={control}
                  name={'recurringPaymentDate'}
                  render={({ field, fieldState: { error } }) => (
                    <Select
                      {...field}
                      label="Select a date"
                      error={!!error}
                      helperText={error?.message}
                      sx={{
                        '& .MuiFormLabel-root': {
                          fontSize: '12px',
                          fontWeight: 300,
                        },
                      }}
                    >
                      {daysInAMonthOptions.map((d) => (
                        <MenuItem value={d.value} key={d.value}>
                          {d.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </TwoColumnLayout>
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default PaymentSettingsContributionDetailsCard;

const generateDaysInMonthsOptions = (
  start: number,
  end: number
): OptionObject[] => {
  const dayList: OptionObject[] = [];
  for (let i = start; i <= end; i++) {
    const suffix = getDayOfTheMonthSuffix(i);
    dayList.push({ label: `${suffix}`, value: i });
  }
  return dayList;
};

function getDateOrFallback(date: unknown | undefined, replacement = '-') {
  if (!date) return replacement;
  const dt = DateTime.fromISO(date as string);
  if (!dt.isValid) return replacement;
  return dt.toFormat('yyyy/MM');
}

interface OptionObject {
  label: string;
  value: number;
}

function getDefaultGoalStartEndDates(goalTimeFrame: number) {
  return {
    startDate: DateTime.now().toFormat('yyyy/MM'),
    endDate: DateTime.now().plus({ years: goalTimeFrame }).toFormat('yyyy/MM'),
  };
}
