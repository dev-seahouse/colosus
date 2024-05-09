import { Typography, Stack, Box } from '@bambu/react-ui';

import RiskToleranceSelectionList from './RiskToleranceSelectionList';

export function RiskToleranceSelection() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">
        Configure the risk tolerance questionnaire{' '}
      </Typography>
      <Box>
        <RiskToleranceSelectionList />
      </Box>
    </Stack>
  );
}

export default RiskToleranceSelection;
