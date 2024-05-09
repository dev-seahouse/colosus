import { Box, Stack, Typography } from '@bambu/react-ui';
import SpeedoMeter from '../SpeedoMeter/SpeedoMeter';
import { SkeletonLoading, useSelectRiskAppetite } from '@bambu/go-core';
import type { ConnectInvestorRiskProfileTypes } from '@bambu/api-client';
import { useSelectInvestorRiskProfilesNamesMap } from '../../hooks/useGetInvestorRiskProfiles/useGetInvestorRiskProfiles.selector';
import { InvestmentResultBottomAction } from './components/InvestmentResultBottomAction';
import { ChangeRiskProfileAction } from './components/ChangeRiskProfileAction';
import { RiskProfileName } from './components/RiskProfileName';

const PLACEHOLDER_RISK_PROFILE_NAME = 'Very Conservative';

export function InvestmentResult() {
  const { data: riskProfiles, isLoading } =
    useSelectInvestorRiskProfilesNamesMap();
  const riskAppetite = useSelectRiskAppetite();

  const riskProfileName =
    riskProfiles?.[riskAppetite as ConnectInvestorRiskProfileTypes]?.name ||
    'Very Conservative';

  const riskProfileDescriptions =
    riskProfiles?.[riskAppetite as ConnectInvestorRiskProfileTypes]
      ?.description || [];

  return (
    <Stack alignItems={'center'} spacing={[1, 4]}>
      <Stack pt={[5, 1]} pb={[1, 0]} alignItems="center" spacing={[3, 2]}>
        {isLoading ? (
          <SkeletonLoading variant={'small'} />
        ) : (
          <SpeedoMeter level={mapInvestStyleToMeterLevel(riskProfileName)} />
        )}

        <Box textAlign="center">
          <RiskProfileName
            investmentStyle={riskProfileName || PLACEHOLDER_RISK_PROFILE_NAME}
          />
        </Box>
      </Stack>

      {isLoading ? (
        <SkeletonLoading variant={'small'} />
      ) : (
        <Stack spacing={2}>
          {riskProfileDescriptions?.map((description, index) => (
            <InvestmentStyleDescription key={index} description={description} />
          ))}
        </Stack>
      )}

      <ChangeRiskProfileAction />
      <InvestmentResultBottomAction />
    </Stack>
  );
}

export default InvestmentResult;

function mapInvestStyleToMeterLevel(
  investStyle: ConnectInvestorRiskProfileTypes
) {
  switch (investStyle) {
    case 'Very Conservative':
      return 1;
    case 'Conservative':
      return 2;
    case 'Balanced':
      return 3;
    case 'Growth':
      return 4;
    case 'Aggressive':
      return 5;
    default:
      throw new Error('Unknown investment style.');
  }
}

function InvestmentStyleDescription(props: { description: any }) {
  return (
    <Typography variant="body2" textAlign="center" gutterBottom={false}>
      {props.description}
    </Typography>
  );
}
