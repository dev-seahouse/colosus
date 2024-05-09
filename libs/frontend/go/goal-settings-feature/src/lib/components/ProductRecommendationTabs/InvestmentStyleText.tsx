import { Typography, Chip } from '@bambu/react-ui';
import {
  useSelectModelPortfolioByRiskProfileId,
  useSelectRiskProfileId,
} from '@bambu/go-core';

export function InvestmentStyleText() {
  const riskProfileId = useSelectRiskProfileId();
  if (!riskProfileId) throw new Error('Risk profile id is not defined');
  const { data: modelPortfolio } = useSelectModelPortfolioByRiskProfileId({
    riskProfileId,
  });

  return (
    <Typography variant="subtitle2">
      Your investment style is{' '}
      <Chip
        color="warning"
        size="small"
        label={modelPortfolio?.key}
        sx={{ fontWeight: 700, color: '#fff' }}
      />
    </Typography>
  );
}

export default InvestmentStyleText;
