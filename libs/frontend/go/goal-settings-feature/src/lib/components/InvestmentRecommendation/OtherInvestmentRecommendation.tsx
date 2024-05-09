import { Typography } from '@bambu/react-ui';
import {
  useSelectGoalTargetYear,
  useSelectGoalValue,
  BoxWithLightenedPrimaryColor,
  CurrencyText,
} from '@bambu/go-core';

import EmphasizedInlineText from './EmphasizedInlineText';
import { useSelectContributionRecommendationQuery } from '../../hooks/useGetOptimizedProjection/useGetOptimizedProjection.selectors';

export const OtherInvestmentRecommendation = () => {
  const targetYear = useSelectGoalTargetYear();
  const goalValue = useSelectGoalValue();
  const { data: contribution = 0 } = useSelectContributionRecommendationQuery();

  return (
    <BoxWithLightenedPrimaryColor p={2}>
      <Typography>
        Invest{' '}
        <EmphasizedInlineText>
          <CurrencyText value={contribution} suffix="/mo" />
        </EmphasizedInlineText>{' '}
        until
        <EmphasizedInlineText>{` ${targetYear} `}</EmphasizedInlineText>
        and you’re likely to achieve your goal of{' '}
        <EmphasizedInlineText>
          <CurrencyText value={goalValue} decimalScale={0} />
        </EmphasizedInlineText>
      </Typography>
    </BoxWithLightenedPrimaryColor>
  );
};

export default OtherInvestmentRecommendation;
