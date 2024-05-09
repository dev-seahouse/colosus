import { Heading } from '@bambu/go-advisor-core';
import { Stack } from '@bambu/react-ui';

import ManageProfileTabs from '../../components/ManageProfileTabs/ManageProfileTabs';

export function ManageProfilePage() {
  return (
    <Stack spacing={4}>
      <Heading title="Profile" />
      <ManageProfileTabs />
    </Stack>
  );
}

export default ManageProfilePage;
