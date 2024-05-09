import { Typography } from '@bambu/react-ui';
import {
  useSelectGoalValue,
  BoxWithLightenedPrimaryColor,
  useSelectInitialInvestment,
} from '@bambu/go-core';
import { CurrencyText } from '@bambu/go-core';

import EmphasizedInlineText from './EmphasizedInlineText';

export const GrowMyWealthRecommendation = () => {
  const goalValue = useSelectGoalValue();
  const initialInvestment = useSelectInitialInvestment() ?? 0;

  return (
    <BoxWithLightenedPrimaryColor p={2}>
      <Typography>
        Your investment of{' '}
        <EmphasizedInlineText>
          <CurrencyText value={initialInvestment} />
        </EmphasizedInlineText>{' '}
        has the potential to grow up to{' '}
        <CurrencyText value={goalValue} decimalScale={0} />
      </Typography>
    </BoxWithLightenedPrimaryColor>
  );
};

export default GrowMyWealthRecommendation;
