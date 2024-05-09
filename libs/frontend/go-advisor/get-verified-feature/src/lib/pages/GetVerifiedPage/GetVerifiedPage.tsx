import React from 'react';
import { Stack, Typography } from '@bambu/react-ui';

import GetVerifiedSteps from '../../components/GetVerifiedSteps/GetVerifiedSteps';
import GetVerifiedKycStatusFailed from '../../components/GetVerifiedKycStatusFailed/GetVerifiedKycStatusFailed';
import { useSelectKycStatus } from '@bambu/go-advisor-core';

export function GetVerifiedPage() {
  const { data: kycStatus } = useSelectKycStatus();
  const isKycRejected = kycStatus && kycStatus === 'KYC_FAILED';
  return (
    <Stack spacing={4}>
      <Stack>
        <Typography variant="h1">Get Verified</Typography>
      </Stack>
      {isKycRejected ? <GetVerifiedKycStatusFailed /> : <GetVerifiedSteps />}
    </Stack>
  );
}

export default GetVerifiedPage;
