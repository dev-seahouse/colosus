import type { TypographyProps } from '@bambu/react-ui';
import { styled, Box, Typography } from '@bambu/react-ui';

const StyledRiskMeter = styled('div')`
  width: 5px;
  background: linear-gradient(
    179.99deg,
    #7af796 0%,
    #f9d728 49.14%,
    #f57575 100%
  );
  border-radius: 8px;
`;

const VerticalTypography = styled(Typography)<TypographyProps>({
  writingMode: 'vertical-rl',
  transform: 'rotate(-180deg)',
  display: 'inline',
});

/**
 * Risk meter
 */
export function RiskMeter() {
  return (
    <Box display="flex" flexDirection="row" height="100%">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent={'space-between'}
      >
        <VerticalTypography
          variant="caption"
          textTransform="uppercase"
          sx={{ alignSelf: 'flex-start' }}
        >
          LOWEST RISK
        </VerticalTypography>
        <VerticalTypography
          variant="caption"
          textTransform="uppercase"
          sx={{ alignSelf: 'flex-end' }}
        >
          HIGHEST RISK
        </VerticalTypography>
      </Box>
      <StyledRiskMeter />
    </Box>
  );
}

export default RiskMeter;
