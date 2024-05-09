import { useSelectGoalType } from '@bambu/go-core';

import RetirementRecommendation from './RetirementRecommendation';
import GrowMyWealthRecommendation from './GrowMyWealthRecommendation';
import OtherInvestmentRecommendation from './OtherInvestmentRecommendation';
/* eslint-disable-next-line */
export interface InvestmentRecommendationProps {}

export function InvestmentRecommendation(props: InvestmentRecommendationProps) {
  const goalType = useSelectGoalType();

  if (goalType === 'Retirement') {
    return <RetirementRecommendation />;
  } else if (goalType === 'Growing Wealth') {
    return <GrowMyWealthRecommendation />;
  }

  return <OtherInvestmentRecommendation />;
}

export default InvestmentRecommendation;
