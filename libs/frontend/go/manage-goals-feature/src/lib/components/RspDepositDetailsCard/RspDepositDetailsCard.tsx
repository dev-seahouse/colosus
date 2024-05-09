import { Card, CardContent, Stack, Typography } from '@bambu/react-ui';
import {
  CurrencyText,
  ErrorLoadingCard,
  formatIsoAsYYYYMM,
  LoadingCard,
  TwoColumnLayout,
  useGetInvestorGoalDetails,
} from '@bambu/go-core';
import { useParams } from 'react-router-dom';

export function RspDepositDetailsCard() {
  const { goalId } = useParams();
  const {
    data: goal,
    isLoading: isLoadingGoal,
    isError: isErrorGoal,
  } = useGetInvestorGoalDetails(
    { goalId: goalId ?? '' },
    { enabled: !!goalId }
  );

  if (isLoadingGoal) {
    return <LoadingCard />;
  }

  if (isErrorGoal) {
    console.error('Error loading goal');
    return <ErrorLoadingCard />;
  }

  if (!goalId) {
    console.error('Goal id is required');
    return <ErrorLoadingCard />;
  }

  return (
    <Card elevation={2}>
      <CardContent>
        <Stack spacing={1.4}>
          <Typography component={'h1'} variant={'body1'} fontWeight={700}>
            Recurring deposit details
          </Typography>

          <TwoColumnLayout>
            <Typography fontSize={'12px'} color={'#191c1b'} fontWeight={300}>
              Amount
            </Typography>
            <Typography fontWeight={700} variant={'body2'}>
              <CurrencyText
                value={goal.GoalRecurringSavingsPlans?.[0]?.amount ?? 0}
              />
            </Typography>
          </TwoColumnLayout>

          <TwoColumnLayout>
            <Typography fontSize={'12px'} color={'#191c1b'} fontWeight={300}>
              Start month
            </Typography>
            <Typography fontWeight={700} variant={'body2'}>
              {formatIsoAsYYYYMM(goal.goalStartDate) ?? '-'}
            </Typography>
          </TwoColumnLayout>

          <TwoColumnLayout>
            <Typography fontSize={'12px'} color={'#191c1b'} fontWeight={300}>
              End month
            </Typography>
            <Typography fontWeight={700} variant={'body2'}>
              {formatIsoAsYYYYMM(goal.goalEndDate) ?? '-'}
            </Typography>
          </TwoColumnLayout>

          <TwoColumnLayout>
            <Typography fontSize={'12px'} color={'#191c1b'} fontWeight={300}>
              Recurring payment date
            </Typography>
            <Typography fontWeight={700} variant={'body2'}>
              -
            </Typography>
          </TwoColumnLayout>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default RspDepositDetailsCard;
