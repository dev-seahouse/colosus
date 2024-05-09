import { Stack, Typography, Box, Button } from '@bambu/react-ui';
import { GoAppPreview } from '@bambu/go-advisor-core';
import { LayoutWithProgress } from '@bambu/go-core';
import { InvestorInvestmentStylePage } from '@bambu/go-onboarding-feature';

export const SelectRiskProfilePreview = () => {
  return (
    <Stack spacing={4}>
      <Typography variant="h4">
        I want to let my clients choose their own risk profile
      </Typography>
      <Box display="flex" justifyContent="space-around">
        <GoAppPreview>
          <LayoutWithProgress>
            <InvestorInvestmentStylePage />
          </LayoutWithProgress>
        </GoAppPreview>
      </Box>
      <Box>
        <Button>Use this configuration</Button>
      </Box>
    </Stack>
  );
};

export default SelectRiskProfilePreview;
