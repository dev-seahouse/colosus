import { Card, Tabs, Tab, Box, Stack } from '@bambu/react-ui';
import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useFeatureFlag } from '@harnessio/ff-react-client-sdk';

import ManageProfileTabPanel from './ManageProfileTabPanel';
import UpdateProfileForm from '../UpdateProfileForm/UpdateProfileForm';
import UpdatePlatformSetupForm from '../UpdatePlatformSetupForm/UpdatePlatformSetupForm';
import UploadProfilePictureSection from '../UploadProfilePictureSection/UploadProfilePictureSection';

function a11yProps(index: number) {
  return {
    id: `manage-profile-tabpanel-${index}`,
    'aria-controls': `manage-profile-tabpanel-${index}`,
  };
}

export function ManageProfileTabs() {
  const [value, setValue] = useState(0);
  const isUploadAvatarEnabled = useFeatureFlag('feature_advisor_avatar');

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Card>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          aria-label="manage profile tabs"
        >
          <Tab label="Personal" {...a11yProps(0)} />
          <Tab label="Robo-advisor setting" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <ManageProfileTabPanel value={value} index={0}>
        <Stack spacing={4}>
          {isUploadAvatarEnabled && <UploadProfilePictureSection />}
          <UpdateProfileForm />
        </Stack>
      </ManageProfileTabPanel>
      <ManageProfileTabPanel value={value} index={1}>
        <UpdatePlatformSetupForm />
      </ManageProfileTabPanel>
    </Card>
  );
}

export default ManageProfileTabs;
