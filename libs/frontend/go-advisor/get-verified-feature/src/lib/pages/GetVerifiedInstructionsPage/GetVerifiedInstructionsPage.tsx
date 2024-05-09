import React from 'react';
import { Typography, Stack } from '@bambu/react-ui';

import GetVerifiedInstructions from '../../components/GetVerifiedInstructions/GetVerifiedInstructions';

export function GetVerifiedInstructionsPage() {
  return (
    <Stack spacing={4}>
      <Stack>
        <Typography variant="h1">Get Verified</Typography>
      </Stack>
      <GetVerifiedInstructions />
    </Stack>
  );
}

export default GetVerifiedInstructionsPage;
