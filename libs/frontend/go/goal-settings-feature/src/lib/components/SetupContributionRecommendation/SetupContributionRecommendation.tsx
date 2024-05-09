import type { ReactNode } from 'react';
import {
  BoxWithLightenedPrimaryColor,
  CurrencyText,
  getNormalizedRecommendedRsp,
  GoalTypeEnum,
  useSelectGoalType,
} from '@bambu/go-core';
import { Box, keyframes, Stack, styled, Typography } from '@bambu/react-ui';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { CircularDotsLoader } from '../CircularDotsLoader/CircularDotsLoader';
import { MIN_RECURRING_DEPOSIT } from '../SetupContributionForm/SetupRecommendationForm.definition';

export interface RetirementContributionRecommendationProps
  extends RecommendationMessageProps {
  isLoading: boolean;
  hasError?: boolean;
}

const fadeIn = keyframes`
  0% { opacity: 0.1; }
  100% { opacity: 1; }
`;

/**
 * Displays recommendation message based on user's rsp input
 */

export function SetupContributionRecommendation({
  monthlySavings,
  recommendedRSP,
  userInputRSP,
  isLoading,
  hasError,
}: RetirementContributionRecommendationProps) {
  return (
    <BoxWithLightenedPrimaryColor
      p={2}
      role="alert"
      data-testid="setup-contribution-recommendation"
    >
      <Stack direction="row" spacing={1}>
        <LightbulbIcon
          sx={{
            color: '#00876a',
            fontSize: 24,
          }}
        />

        <Box
          display="flex"
          flexDirection="column"
          flexGrow={1}
          justifyContent={'center'}
          alignItems={'center'}
        >
          {isLoading || hasError ? (
            <CircularDotsLoader />
          ) : (
            <RecommendationMessage
              monthlySavings={monthlySavings}
              recommendedRSP={recommendedRSP}
              userInputRSP={userInputRSP}
            />
          )}
        </Box>
      </Stack>
    </BoxWithLightenedPrimaryColor>
  );
}

interface RecommendationMessageProps {
  // user previously entered monthly income
  monthlySavings: number;
  // recommended monthly contribution from goal-helper api
  recommendedRSP: number; // should this be undefined | number ??
  /** user entered rsp amount:
   *  when its value is 0 or undefined, it is treated as uer has not entered any value
   *  default message would be shown in such cases.
   */
  userInputRSP?: number | undefined;
  // loading state of goal-helper api, determine if loading animation should be shown
}

// note: if more use cases are added or more complex conditional rendering is needed,
// consider let parent component handle the conditional logic and render message by type
// e.g <RetirementContributionRecommendation type={TYPES.GOOD} />
function RecommendationMessage({
  monthlySavings,
  recommendedRSP,
  userInputRSP,
}: RecommendationMessageProps) {
  const userEnteredNothingOrZero = userInputRSP === 0 || !userInputRSP;
  const hasNotEnoughMonthlySaving = monthlySavings < recommendedRSP;
  const hasEnteredMoreThanRecommendedRsp = userInputRSP! >= recommendedRSP;
  const hasLargeEnoughInitialDeposit =
    userEnteredNothingOrZero && recommendedRSP === 0; // user have not entered rsp but recommendation api is recommending 0, it indicates that user has entered large enough initial deposit to cover the entire investment without rsp
  switch (true) {
    case !userEnteredNothingOrZero && hasNotEnoughMonthlySaving:
      return <LowMonthlySavingsMessage recommendedRSP={recommendedRSP} />;
    case (!userEnteredNothingOrZero && hasEnteredMoreThanRecommendedRsp) ||
      hasLargeEnoughInitialDeposit:
      return <GoodRspInputMessage />;
    default:
      return <DefaultMessage recommendedRSP={recommendedRSP} />;
  }
}

function LowMonthlySavingsMessage({
  recommendedRSP,
}: Pick<RecommendationMessageProps, 'recommendedRSP'>) {
  const goalType = useSelectGoalType();

  return (
    <Box
      display="flex"
      flexDirection="column"
      data-testid="rsp-recommendation-low"
      sx={{
        animation: `${fadeIn} .6s ease`,
      }}
    >
      <Typography gutterBottom>
        Invest a monthly recurring deposit of{' '}
        <Strong>
          <CurrencyText value={recommendedRSP} />
        </Strong>{' '}
        to increase the likelihood of achieving your goal. However, please note
        that this amount exceeds your disposable income.
      </Typography>
      <Typography>Here are a few tips to consider:</Typography>
      <Ol>
        <Typography as="li">
          Explore options to lower your monthly expenses
        </Typography>
        <Typography as="li">
          {goalType === GoalTypeEnum.Retirement
            ? 'Consider delaying your retirement age'
            : 'Consider extending the goal year'}
        </Typography>
        <Typography as="li">
          Add an initial deposit to reduce the monthly recurring deposit amount
        </Typography>
      </Ol>
    </Box>
  );
}
function GoodRspInputMessage() {
  return (
    <Box
      data-testid={'rsp-recommendation-good'}
      sx={{
        animation: `${fadeIn} .6s ease`,
      }}
    >
      <Typography>
        Excellent! Your chances of reaching the target goal are much higher.
      </Typography>
    </Box>
  );
}

function DefaultMessage({
  recommendedRSP,
}: Pick<RecommendationMessageProps, 'recommendedRSP'>) {
  const normalisedRSP = getNormalizedRecommendedRsp(
    recommendedRSP,
    MIN_RECURRING_DEPOSIT
  );
  return (
    <Box
      data-testid={'rsp-recommendation-default'}
      sx={{
        animation: `${fadeIn} .6s ease`,
      }}
    >
      <Typography>
        Invest a monthly recurring deposit of{' '}
        <Strong>
          <CurrencyText value={normalisedRSP} />
        </Strong>{' '}
        to increase the likelihood of achieving your goal. Please review this
        amount considering your financial situation.
      </Typography>
    </Box>
  );
}

const Strong = ({ children }: { children: ReactNode }) => (
  <Typography as="strong" sx={{ fontWeight: 700 }}>
    {children}
  </Typography>
);

const Ol = styled('ol')({
  marginBlockStart: 0,
});

export default SetupContributionRecommendation;
