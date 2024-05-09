import { Stack, Typography, Box } from '@bambu/react-ui';
import { useSelectHasUserCompletedProfileQuery } from '@bambu/go-advisor-core';

import ClientExperienceAccordionDetails from '../ClientExperienceAccordionDetails';
import TimeToCompleteText from '../TimeToCompleteText';
import CompleteProfileImg from './assets/profile-complete.svg';
import ProfileAccordionButton from './ProfileAccordionButton';

export const ProfileAccordionDetails = () => {
  const { data: hasUserCompletedProfile } =
    useSelectHasUserCompletedProfileQuery();

  return (
    <ClientExperienceAccordionDetails>
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <Stack spacing={3}>
          <Typography>
            Tell us about yourself and your business so we can give you the best
            starting point for building your robo-advisor.{' '}
          </Typography>
        </Stack>
        <Box display="flex" alignItems="center" sx={{ gap: 2 }}>
          <ProfileAccordionButton />
          {!hasUserCompletedProfile && (
            <TimeToCompleteText expectedTimeToComplete={3} />
          )}
        </Box>
      </Stack>
      <img
        src={CompleteProfileImg}
        alt="Complete Profile"
        width={256}
        height={147}
      />
    </ClientExperienceAccordionDetails>
  );
};

export default ProfileAccordionDetails;
