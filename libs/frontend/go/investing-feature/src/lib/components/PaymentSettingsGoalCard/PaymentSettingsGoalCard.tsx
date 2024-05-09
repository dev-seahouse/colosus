import {
  Box,
  Card,
  CardContent,
  ErrorLoadingData,
  Typography,
} from '@bambu/react-ui';
import type { GoalType } from '@bambu/go-core';
import {
  CurrencyText,
  pluralize,
  SkeletonLoading,
  useGetInvestorGoalDetails,
} from '@bambu/go-core';
import { PaymentSettingsCardHeader } from '../PaymentSettingsCardHeader/PaymentSettingsCardHeader';
import { useParams } from 'react-router-dom';
import { getPaymentPlanName } from './PaymentSettingsGoalCard.utils';

/**
 * Payment settings goal card
 * displays goal information goal name, timeframe and target goal
 */
export function PaymentSettingsGoalCard() {
  const { goalId } = useParams();
  const {
    data: goal,
    isLoading: isGoalLoading,
    isError: isGoalError,
  } = useGetInvestorGoalDetails(
    { goalId: goalId ?? '' },
    { enabled: !!goalId }
  );

  if (!goalId) {
    console.error('Goal id is required');
    return (
      <Card>
        <CardContent>
          <ErrorLoadingData />
        </CardContent>
      </Card>
    );
  }

  if (isGoalLoading) {
    return (
      <Card>
        <CardContent>
          <SkeletonLoading variant={'small'} />
        </CardContent>
      </Card>
    );
  }

  if (isGoalError) {
    console.error('Error loading profile');
    return (
      <Card>
        <CardContent>
          <ErrorLoadingData />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={2}>
      <CardContent sx={{ '&&': { paddingBottom: 1.3 } }}>
        <PaymentSettingsCardHeader>
          {getPaymentPlanName(
            (goal?.goalName as GoalType) ?? '',
            goal?.goalDescription ?? ''
          )}
        </PaymentSettingsCardHeader>
        <Box
          display="grid"
          gridTemplateColumns={'1fr 1fr'}
          gridTemplateRows="auto auto"
          justifyItems={'flex-start'}
          rowGap={'.4rem'}
        >
          <Typography fontWeight={300} fontSize={'12px'}>
            Target goal
          </Typography>
          <Typography fontWeight={300} fontSize={'12px'}>
            Timeframe
          </Typography>
          <Typography fontWeight="bold" variant={'body2'}>
            <CurrencyText value={goal?.goalValue ?? 0} decimalScale={2} />
          </Typography>
          <Typography fontWeight="bold" variant={'body2'}>
            {pluralize(goal?.goalTimeframe ?? 0, 'year')}
          </Typography>
        </Box>{' '}
      </CardContent>
    </Card>
  );
}

export default PaymentSettingsGoalCard;
