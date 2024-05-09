import {
  CurrencyText,
  getActiveMandate,
  getDefaultGoalStartEndDate,
  getGoalStatusLabel,
  getTimeLeftInYM,
  getValidDateOrFallBack,
  LoadingCard,
  useSelectHasActiveDirectDebitSubscriptions,
  useSelectHasPendingDirectDebitSubscriptions,
} from '@bambu/go-core';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from '@bambu/react-ui';
import { DateTime } from 'luxon';
import { useNavigate } from 'react-router-dom';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import { GoalCardHeader } from '../GoalCardHeader/GoalCardHeader';
import { useDashboardData } from '../../hooks/useDashboardData';
import { GoalStatusEnum } from '@bambu/shared';

export interface GoalCardProps {
  goalEndDateISO?: string; // iso string
  goalTitle: string;
  goalValue: number;
  goalTimeframe: number;
  goalStatus: GoalStatusEnum;
  portfolioValue: number;
  cumulativeReturn: number;
  recurringDeposit: number;
  goalId: string;
  isReadyToInvest?: boolean;
}

export function GoalCard({
  goalEndDateISO,
  goalStatus,
  goalTimeframe,
  goalTitle,
  goalValue,
  portfolioValue,
  cumulativeReturn,
  recurringDeposit,
  goalId,
}: GoalCardProps) {
  const navigate = useNavigate();
  const normalizedGoalEndDateISO = getValidDateOrFallBack(
    goalEndDateISO,
    getDefaultGoalStartEndDate(goalTimeframe).endDate.toISO()
  );
  const { isReadyToInvest, isLoading, mandatesData } = useDashboardData();
  const activeMandate = getActiveMandate(mandatesData);

  const hasActiveDirectDebitSubscription =
    useSelectHasActiveDirectDebitSubscriptions(
      {
        goalId: goalId,
        mandateId: activeMandate?.id ?? '',
      },
      {
        enabled: !!activeMandate?.id && !!goalId,
      }
    );

  const hasPendingDirectDebitSubscription =
    useSelectHasPendingDirectDebitSubscriptions(
      {
        goalId: goalId,
        mandateId: activeMandate?.id ?? '',
      },
      {
        enabled: !!activeMandate?.id && !!goalId,
      }
    );

  function shouldShowFundMyGoalButton(goalStatus: GoalStatusEnum) {
    if (!isReadyToInvest) {
      return false;
    }

    if (hasActiveDirectDebitSubscription.data) {
      return false;
    }

    return !(
      goalStatus === GoalStatusEnum.ACTIVE ||
      goalStatus === GoalStatusEnum.CREATED
    );
  }

  if (isLoading) {
    return <LoadingCard />;
  }

  return (
    <Card sx={{ px: 0.8, ':hover': { boxShadow: 2 } }}>
      <CardContent>
        <Stack spacing={2}>
          <GoalCardHeader
            goalTitle={goalTitle}
            goalValue={goalValue}
            goalEndYear={DateTime.fromISO(
              normalizedGoalEndDateISO
            ).year.toString()}
            goalStatusLabel={getGoalStatusLabel(goalStatus)}
          />

          <Stack sx={{ position: 'relative' }} spacing={1.6}>
            {/*left*/}
            <Box display={'flex'}>
              <Box flexGrow={1} flexShrink={1} flexBasis={'40%'}>
                <Typography fontSize={12} fontWeight={300}>
                  Portfolio value
                </Typography>
                <Typography variant={'body2'} fontWeight={'bold'}>
                  <CurrencyText value={portfolioValue} decimalScale={2} />
                </Typography>
              </Box>

              <Box flexGrow={1} flexShrink={1} flexBasis={'40%'}>
                <Typography fontSize={12} fontWeight={300}>
                  Time left
                </Typography>
                <Typography variant={'body2'} fontWeight={'bold'}>
                  {getTimeLeftInYM(normalizedGoalEndDateISO)}
                </Typography>
              </Box>
            </Box>

            {/* center */}
            <IconButton
              aria-label={'go to goal details'}
              onClick={() => navigate(`../goal-details/${goalId}`)}
              sx={{
                position: 'absolute',
                cursor: 'pointer',
                right: 0,
                fontSize: '35px',
              }}
            >
              <PlayCircleOutlineOutlinedIcon color="primary" />
            </IconButton>

            {/* right */}
            <Box display={'flex'}>
              <Box flexGrow={1} flexShrink={1} flexBasis={'40%'}>
                <Typography fontSize={12} fontWeight={300}>
                  Cumulative return
                </Typography>
                <Typography variant={'body2'} fontWeight={'bold'}>
                  {cumulativeReturn}%
                </Typography>
              </Box>
              <Box flexGrow={1} flexShrink={1} flexBasis={'40%'}>
                <Typography fontSize={12} fontWeight={300}>
                  Recurring deposit
                </Typography>
                <Typography variant={'body2'} fontWeight={'bold'}>
                  <CurrencyText value={recurringDeposit} decimalScale={2} />
                </Typography>
              </Box>
            </Box>
          </Stack>

          {shouldShowFundMyGoalButton(goalStatus) ? (
            <Box
              sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}
            >
              <Button
                onClick={() => navigate(`/payment-settings/${goalId}`)}
                isLoading={
                  hasPendingDirectDebitSubscription.isLoading ||
                  hasActiveDirectDebitSubscription.isLoading
                }
              >
                Fund My Goal
              </Button>
            </Box>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default GoalCard;
