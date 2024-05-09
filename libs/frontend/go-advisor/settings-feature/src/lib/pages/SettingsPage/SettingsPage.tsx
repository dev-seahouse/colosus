import { useGetTopLevelOptions, Heading } from '@bambu/go-advisor-core';
import type { GetTopLevelOptionsData } from '@bambu/go-advisor-core';
import { Stack } from '@bambu/react-ui';

import SettingsForm from '../../components/SettingsForm/SettingsForm';

export interface SettingsPageProps {
  topLevelOptions?: GetTopLevelOptionsData;
}

export function SettingsPage({ topLevelOptions }: SettingsPageProps) {
  useGetTopLevelOptions({ initialData: topLevelOptions });

  return (
    <Stack spacing={4}>
      <Heading title="Settings" />
      <SettingsForm />
    </Stack>
  );
}

export default SettingsPage;
