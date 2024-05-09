import {
  Card,
  CardContent,
  CardHeader,
  Collapse,
  ErrorLoadingData,
  Stack,
  Typography,
} from '@bambu/react-ui';
import {
  CurrencyText,
  getGoalEndDate,
  getTimeLeftInYM,
  SkeletonLoading,
  useGetInvestorGoalDetails,
} from '@bambu/go-core';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import GoalSummaryField from '../GoalSummaryField/GoalSummaryField';
import AccordionExpandIcon from '../AccordionExpandIcon/AccordionExpandIcon';
import { useReducer } from 'react';

export function GoalSummaryCard({
  isInitialOpen = false,
  goalId,
}: {
  isInitialOpen?: boolean;
  goalId: string | undefined;
}) {
  const [isExpanded, toggleExpanded] = useReducer(
    (state) => !state,
    isInitialOpen
  );

  const {
    data: goal,
    isSuccess: isGoalSuccess,
    isLoading: isGoalLoading,
  } = useGetInvestorGoalDetails(
    { goalId: goalId ?? '' },
    {
      enabled: !!goalId,
    }
  );

  if (!goalId) {
    // user enters the route without goalId queryString
    console.error('GoalSummaryCard: goalId is not found');
    return <ErrorLoadingData />;
  }

  if (isGoalLoading) {
    return <SkeletonLoading variant={'small'} />;
  }

  if (isGoalSuccess && !goal) {
    // profile is loaded but goal is not found based on the queryString goalId
    console.error('GoalSummaryCard: goal is not found based goalId');
    return <ErrorLoadingData />;
  }

  return (
    <Card elevation={2}>
      <CardHeader
        onClick={toggleExpanded}
        sx={{ cursor: 'pointer', py: '10px' }}
        title={
          <Stack
            direction="row"
            justifyContent={'space-between'}
            alignItems="center"
          >
            <Typography fontWeight={'bold'} variant={'body2'}>
              Goal summary
            </Typography>
            <AccordionExpandIcon
              expand={isExpanded}
              aria-expanded={isExpanded}
              aria-label="show more"
            >
              <ExpandMoreIcon color={'primary'} />
            </AccordionExpandIcon>
          </Stack>
        }
      />

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          <Stack spacing={2}>
            <GoalSummaryField
              title="Portfolio value"
              value={
                <CurrencyText
                  value={goal?.portfolioValue ?? 0}
                  decimalScale={2}
                />
              }
            />

            <GoalSummaryField
              title="Cumulative return"
              value={`${(goal?.portfolioCumulativeReturn ?? 0).toLocaleString(
                'en',
                { style: 'percent' }
              )}`}
            />

            <GoalSummaryField
              title="Goal investment style"
              value={goal?.ConnectPortfolioSummary?.RiskProfile.riskProfileName}
            />

            <GoalSummaryField title="Account type" value="GIA" />

            <GoalSummaryField
              isHidden={goal?.GoalRecurringSavingsPlans?.length === 0}
              title="Monthly recurring deposit"
              value={
                <CurrencyText
                  value={goal?.GoalRecurringSavingsPlans?.[0].amount ?? 0}
                  decimalScale={2}
                />
              }
            />

            <GoalSummaryField
              title="Time Left"
              value={getTimeLeftInYM(
                getGoalEndDate(goal?.goalEndDate, goal?.goalTimeframe ?? 0)
              )}
            />

            <GoalSummaryField
              title="Net deposit"
              value={<CurrencyText value={0} decimalScale={2} />}
              isHidden={true}
            />

            <GoalSummaryField
              title="Amount withdrawn"
              value={<CurrencyText value={0} decimalScale={2} />}
              isHidden={true}
            />
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default GoalSummaryCard;
